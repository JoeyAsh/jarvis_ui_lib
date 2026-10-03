import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { WindowManager } from '../WindowManager';
import type { ManagedWindow } from '../WindowManager';
import { SfxProvider } from '@core/audio';
import type { SlotId } from '../../../window/slotGrid';
import { computeAllSlots } from '../../../window/slotGrid';
import { measureContainer, toLocalPoint } from '../utils';
import type { ContainerGeometry } from '../WindowManager.types';

const VW = 1280;
const VH = 900;

const WIN_A: ManagedWindow = {
    id: 'win-a',
    title: 'Alpha',
    itemRenderer: () => <div>Alpha body</div>,
};

function noop(): void {
    /* intentional no-op */
}

function renderWithSfx(ui: ReactNode): ReturnType<typeof render> {
    return render(
        <SfxProvider playOneShot={vi.fn()} play={vi.fn()} stop={vi.fn()}>
            {ui}
        </SfxProvider>,
    );
}

/** Mock the layout rect reported for the WindowManager root element. */
function mockRootRect(rect: ContainerGeometry): void {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
    ) {
        if (this.classList.contains('lib-wm')) {
            return {
                x: rect.left,
                y: rect.top,
                left: rect.left,
                top: rect.top,
                width: rect.w,
                height: rect.h,
                right: rect.left + rect.w,
                bottom: rect.top + rect.h,
                toJSON: () => ({}),
            };
        }
        return new DOMRect(0, 0, 0, 0);
    });
}

type ResizeCb = () => void;
let observerCallbacks: ResizeCb[] = [];

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    Object.defineProperty(window, 'innerWidth', { value: VW, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: VH, writable: true, configurable: true });
    observerCallbacks = [];
    class MockResizeObserver {
        constructor(cb: ResizeCb) {
            observerCallbacks.push(cb);
        }
        observe(): void {
            /* noop */
        }
        unobserve(): void {
            /* noop */
        }
        disconnect(): void {
            /* noop */
        }
    }
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('measureContainer / toLocalPoint', () => {
    it('falls back to the viewport when the element has no layout box', () => {
        expect(measureContainer(null)).toEqual({ w: VW, h: VH, left: 0, top: 0 });
        const el = document.createElement('div');
        expect(measureContainer(el)).toEqual({ w: VW, h: VH, left: 0, top: 0 });
    });

    it('reports size and offset from getBoundingClientRect', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const el = document.createElement('div');
        el.className = 'lib-wm';
        expect(measureContainer(el)).toEqual({ w: 900, h: 600, left: 140, top: 20 });
    });

    it('converts client coordinates to container-local coordinates', () => {
        expect(toLocalPoint(300, 200, { w: 900, h: 600, left: 140, top: 20 })).toEqual({
            x: 160,
            y: 180,
        });
        expect(toLocalPoint(300, 200, { w: VW, h: VH, left: 0, top: 0 })).toEqual({
            x: 300,
            y: 200,
        });
    });
});

describe('WindowManager — container-relative geometry', () => {
    it('lays out slots from the container size, not the viewport', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'R1' }}
                onAssignmentsChange={noop}
            />,
        );
        const r1 = computeAllSlots(900, 600).R1;
        const win = container.querySelector<HTMLDivElement>('[data-window-id="win-a"]');
        expect(win?.style.left).toBe(`${r1.x}px`);
        expect(win?.style.top).toBe(`${r1.y}px`);
        // Right column must be fully inside the container.
        expect(r1.x + r1.w).toBeLessThanOrEqual(900);
    });

    it('keeps full-viewport behaviour unchanged when container equals viewport', () => {
        mockRootRect({ w: VW, h: VH, left: 0, top: 0 });
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'R1' }}
                onAssignmentsChange={noop}
            />,
        );
        const r1 = computeAllSlots(VW, VH).R1;
        const win = container.querySelector<HTMLDivElement>('[data-window-id="win-a"]');
        expect(win?.style.left).toBe(`${r1.x}px`);
        expect(win?.style.width).toBe(`${r1.w}px`);
    });

    it('converts pointer coordinates to local space when snapping on drop', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const onAssignmentsChange = vi.fn();
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'L1' }}
                onAssignmentsChange={onAssignmentsChange}
            />,
        );
        const l2 = computeAllSlots(900, 600).L2;
        // Client coords = local centre + container offset.
        const clientX = l2.x + l2.w / 2 + 140;
        const clientY = l2.y + l2.h / 2 + 20;

        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 200, clientY: 120 });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }));
        });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX, clientY }));
        });

        expect(onAssignmentsChange).toHaveBeenCalledOnce();
        const [next] = onAssignmentsChange.mock.calls[0] as [Record<string, SlotId>];
        expect(next['win-a']).toBe('L2');
    });

    it('does not treat un-offset client coordinates as the local point', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const onAssignmentsChange = vi.fn();
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'L1' }}
                onAssignmentsChange={onAssignmentsChange}
            />,
        );
        const l2 = computeAllSlots(900, 600).L2;
        // After offset subtraction this point lands left of every slot.
        const clientX = l2.x + l2.w / 2 - 300;
        const clientY = l2.y + l2.h / 2;
        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 200, clientY: 120 });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX, clientY }));
        });
        expect(onAssignmentsChange).not.toHaveBeenCalled();
    });

    it('re-lays out when the container is resized (ResizeObserver)', () => {
        mockRootRect({ w: 900, h: 600, left: 0, top: 0 });
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'R1' }}
                onAssignmentsChange={noop}
            />,
        );
        const win = (): HTMLDivElement | null =>
            container.querySelector<HTMLDivElement>('[data-window-id="win-a"]');
        expect(win()?.style.left).toBe(`${computeAllSlots(900, 600).R1.x}px`);

        vi.restoreAllMocks();
        mockRootRect({ w: 1100, h: 700, left: 0, top: 0 });
        act(() => {
            observerCallbacks.forEach((cb) => {
                cb();
            });
        });
        expect(win()?.style.left).toBe(`${computeAllSlots(1100, 700).R1.x}px`);
    });
});
