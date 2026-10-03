import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { WindowManager } from '../WindowManager';
import type { ManagedWindow } from '../WindowManager';
import { SfxProvider } from '@core/audio';
import type { SlotId } from '../../../window/slotGrid';
import { computeAllSlots, slotAtPoint, SLOT_IDS } from '../../../window/slotGrid';
import { measureContainer, toLocalPoint, clampExpandedRect, defaultExpandedRect } from '../utils';
import { MIN_EXPANDED_W, MIN_EXPANDED_H } from '../constants';
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
let observeSpy = vi.fn();
let disconnectSpy = vi.fn();

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    Object.defineProperty(window, 'innerWidth', { value: VW, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: VH, writable: true, configurable: true });
    observerCallbacks = [];
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    class MockResizeObserver {
        constructor(cb: ResizeCb) {
            observerCallbacks.push(cb);
        }
        observe(el: Element): void {
            observeSpy(el);
        }
        unobserve(): void {
            /* noop */
        }
        disconnect(): void {
            disconnectSpy();
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
        expect(win?.style.getPropertyValue('--lib-window-x')).toBe(`${r1.x}px`);
        expect(win?.style.getPropertyValue('--lib-window-y')).toBe(`${r1.y}px`);
        // Right column must be fully inside the container.
        expect(r1.x + r1.w).toBeLessThanOrEqual(900);
    });

    it('falls back to window.innerWidth/innerHeight for every slot when the container has no layout box', () => {
        // No rect mock: jsdom reports a 0x0 box, so measureContainer uses the viewport.
        const windows: ManagedWindow[] = SLOT_IDS.map((slot) => ({
            id: `win-${slot}`,
            title: `Win ${slot}`,
            itemRenderer: () => <div>{slot}</div>,
        }));
        const assignments: Record<string, SlotId> = {};
        SLOT_IDS.forEach((slot) => {
            assignments[`win-${slot}`] = slot;
        });
        const { container } = renderWithSfx(
            <WindowManager
                windows={windows}
                assignments={assignments}
                onAssignmentsChange={noop}
            />,
        );
        const expected = computeAllSlots(window.innerWidth, window.innerHeight);
        SLOT_IDS.forEach((slot) => {
            const win = container.querySelector<HTMLDivElement>(`[data-window-id="win-${slot}"]`);
            expect(win?.style.getPropertyValue('--lib-window-x')).toBe(`${expected[slot].x}px`);
            expect(win?.style.getPropertyValue('--lib-window-y')).toBe(`${expected[slot].y}px`);
            expect(win?.style.getPropertyValue('--lib-window-w')).toBe(`${expected[slot].w}px`);
            expect(win?.style.getPropertyValue('--lib-window-h')).toBe(`${expected[slot].h}px`);
        });
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
        const slots = computeAllSlots(900, 600);
        // Raw client point sits inside L2 horizontally, but after subtracting the
        // 140px container offset the local x is left of every slot.
        const clientX = 100;
        const clientY = slots.L2.y + slots.L2.h / 2 + 20;
        // The raw (un-offset) point DOES hit a slot, so only the conversion prevents a snap.
        expect(slotAtPoint(clientX, clientY, slots)).not.toBeNull();
        expect(slotAtPoint(clientX - 140, clientY - 20, slots)).toBeNull();

        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 200, clientY: 120 });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }));
        });
        expect(container.querySelector('.lib-snap__zone--hovered')).toBeNull();
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
        expect(win()?.style.getPropertyValue('--lib-window-x')).toBe(
            `${computeAllSlots(900, 600).R1.x}px`,
        );

        vi.restoreAllMocks();
        mockRootRect({ w: 1100, h: 700, left: 0, top: 0 });
        act(() => {
            observerCallbacks.forEach((cb) => {
                cb();
            });
        });
        expect(win()?.style.getPropertyValue('--lib-window-x')).toBe(
            `${computeAllSlots(1100, 700).R1.x}px`,
        );
    });
});

function getWin(container: HTMLElement): HTMLDivElement | null {
    return container.querySelector<HTMLDivElement>('[data-window-id="win-a"]');
}

function readRect(win: HTMLElement | null): { x: number; y: number; w: number; h: number } {
    return {
        x: parseFloat(win?.style.getPropertyValue('--lib-window-x') ?? 'NaN'),
        y: parseFloat(win?.style.getPropertyValue('--lib-window-y') ?? 'NaN'),
        w: parseFloat(win?.style.getPropertyValue('--lib-window-w') ?? 'NaN'),
        h: parseFloat(win?.style.getPropertyValue('--lib-window-h') ?? 'NaN'),
    };
}

function renderUncontrolled(): ReturnType<typeof renderWithSfx> {
    return renderWithSfx(
        <WindowManager
            windows={[WIN_A]}
            assignments={{ 'win-a': 'L1' }}
            onAssignmentsChange={noop}
        />,
    );
}

function toggleMode(): void {
    const btn =
        screen.queryByRole('button', { name: 'Undock window' }) ??
        screen.getByRole('button', { name: 'Dock window' });
    fireEvent.click(btn);
}

function fireObservers(): void {
    act(() => {
        observerCallbacks.forEach((cb) => {
            cb();
        });
    });
}

describe('WindowManager — expanded rect re-clamp on container resize', () => {
    it('clamps uncontrolled expanded rects when the container shrinks', () => {
        mockRootRect({ w: VW, h: VH, left: 0, top: 0 });
        const { container } = renderUncontrolled();
        toggleMode();
        const before = readRect(getWin(container));
        expect(before.w).toBeGreaterThan(400);

        mockRootRect({ w: 400, h: 300, left: 0, top: 0 });
        fireObservers();

        const after = readRect(getWin(container));
        expect(after).toEqual(clampExpandedRect(before, 400, 300));
        expect(after.w).toBeLessThanOrEqual(400);
        expect(after.h).toBeLessThanOrEqual(300);
    });

    it('leaves uncontrolled expanded rects untouched when the container grows', () => {
        mockRootRect({ w: VW, h: VH, left: 0, top: 0 });
        const { container } = renderUncontrolled();
        toggleMode();
        const before = readRect(getWin(container));

        mockRootRect({ w: 1600, h: 1000, left: 0, top: 0 });
        fireObservers();

        expect(readRect(getWin(container))).toEqual(before);
    });

    it('does not rewrite controlled expanded rects when the container shrinks', () => {
        mockRootRect({ w: VW, h: VH, left: 0, top: 0 });
        const rect = { x: 100, y: 100, w: 1000, h: 700 };
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'L1' }}
                onAssignmentsChange={noop}
                modes={{ 'win-a': 'expanded' }}
                expandedRects={{ 'win-a': rect }}
                onModesChange={noop}
            />,
        );
        mockRootRect({ w: 400, h: 300, left: 0, top: 0 });
        fireObservers();
        expect(readRect(getWin(container))).toEqual(rect);
    });
});

describe('WindowManager — mode toggle derives expanded rect from container size', () => {
    it('uses defaultExpandedRect of the container-relative slot on first expand', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderUncontrolled();
        toggleMode();
        const expected = defaultExpandedRect(computeAllSlots(900, 600).L1, 900, 600);
        expect(readRect(getWin(container))).toEqual(expected);
    });

    it('clamps a previously stored expanded rect to the current container size on re-expand', () => {
        mockRootRect({ w: VW, h: VH, left: 0, top: 0 });
        const { container } = renderUncontrolled();
        toggleMode(); // expand
        const stored = readRect(getWin(container));
        toggleMode(); // dock again (rect stays stored)
        expect(getWin(container)?.getAttribute('data-mode')).toBe('compact');

        // Container shrinks without a ResizeObserver notification: toggle must re-measure.
        mockRootRect({ w: 400, h: 300, left: 0, top: 0 });
        toggleMode(); // expand again
        expect(getWin(container)?.getAttribute('data-mode')).toBe('expanded');
        expect(readRect(getWin(container))).toEqual(clampExpandedRect(stored, 400, 300));
    });
});

describe('WindowManager — expanded free-drag bounds', () => {
    function startExpandedDrag(container: HTMLElement): void {
        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 500, clientY: 300 });
    }

    it('clamps the dragged rect to the right/bottom edge of the container, not the viewport', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderUncontrolled();
        toggleMode();
        const start = readRect(getWin(container));
        startExpandedDrag(container);
        act(() => {
            window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5500, clientY: 5300 }));
        });
        const live = readRect(getWin(container));
        expect(live.x).toBe(Math.max(0, 900 - start.w));
        expect(live.y).toBe(Math.max(60, 600 - start.h));
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX: 5500, clientY: 5300 }));
        });
    });

    it('clamps the dragged rect to the left edge and top bar when dragged far up-left', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderUncontrolled();
        toggleMode();
        startExpandedDrag(container);
        act(() => {
            window.dispatchEvent(
                new PointerEvent('pointermove', { clientX: -4500, clientY: -4700 }),
            );
        });
        const live = readRect(getWin(container));
        expect(live.x).toBe(0);
        expect(live.y).toBe(60);
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX: -4500, clientY: -4700 }));
        });
    });

    it('commits the clamped position to the expanded rect on drop', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderUncontrolled();
        toggleMode();
        const start = readRect(getWin(container));
        startExpandedDrag(container);
        act(() => {
            window.dispatchEvent(new PointerEvent('pointermove', { clientX: 5500, clientY: 5300 }));
        });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX: 5500, clientY: 5300 }));
        });
        const after = readRect(getWin(container));
        expect(after.x).toBe(Math.max(0, 900 - start.w));
        expect(after.w).toBe(start.w);
        expect(after.w).toBeGreaterThanOrEqual(MIN_EXPANDED_W);
        expect(after.h).toBeGreaterThanOrEqual(MIN_EXPANDED_H);
    });
});

describe('WindowManager — snapTarget hit-testing with an offset container', () => {
    it('highlights the slot under the container-local pointer during pointermove', () => {
        mockRootRect({ w: 900, h: 600, left: 140, top: 20 });
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'L1' }}
                onAssignmentsChange={noop}
            />,
        );
        const r2 = computeAllSlots(900, 600).R2;
        const clientX = r2.x + r2.w / 2 + 140;
        const clientY = r2.y + r2.h / 2 + 20;
        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 200, clientY: 120 });
        act(() => {
            window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY }));
        });

        const hovered = container.querySelectorAll('.lib-snap__zone--hovered');
        expect(hovered).toHaveLength(1);
        expect(hovered[0].getAttribute('data-slot')).toBe('R2');
        act(() => {
            window.dispatchEvent(new PointerEvent('pointerup', { clientX, clientY }));
        });
    });
});

describe('WindowManager — lifecycle and window resize', () => {
    it('removes the window resize listener and disconnects the observer on unmount', () => {
        mockRootRect({ w: 900, h: 600, left: 0, top: 0 });
        const addSpy = vi.spyOn(window, 'addEventListener');
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { container, unmount } = renderUncontrolled();

        const resizeAdds = addSpy.mock.calls.filter(([type]) => type === 'resize');
        expect(resizeAdds).toHaveLength(1);
        const handler = resizeAdds[0][1];
        expect(observeSpy).toHaveBeenCalledWith(container.querySelector('.lib-wm'));
        expect(disconnectSpy).not.toHaveBeenCalled();

        unmount();

        expect(removeSpy).toHaveBeenCalledWith('resize', handler);
        expect(disconnectSpy).toHaveBeenCalledOnce();
    });

    it('re-lays out when the window resize event fires', () => {
        mockRootRect({ w: 900, h: 600, left: 0, top: 0 });
        const { container } = renderWithSfx(
            <WindowManager
                windows={[WIN_A]}
                assignments={{ 'win-a': 'R1' }}
                onAssignmentsChange={noop}
            />,
        );
        expect(getWin(container)?.style.getPropertyValue('--lib-window-x')).toBe(
            `${computeAllSlots(900, 600).R1.x}px`,
        );

        mockRootRect({ w: 1100, h: 700, left: 0, top: 0 });
        act(() => {
            window.dispatchEvent(new Event('resize'));
        });
        expect(getWin(container)?.style.getPropertyValue('--lib-window-x')).toBe(
            `${computeAllSlots(1100, 700).R1.x}px`,
        );
    });
});
