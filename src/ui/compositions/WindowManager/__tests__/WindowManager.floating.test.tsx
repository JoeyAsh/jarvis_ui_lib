import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { useState, type ReactElement, type ReactNode } from 'react';
import { WindowManager } from '../WindowManager';
import type { ExpandedRect, ManagedWindow } from '../WindowManager';
import { SfxProvider } from '@core/audio';
import type { SfxEvent } from '@core/audio';

const VW = 1280;
const VH = 900;

function windowPointerEvent(type: string, init?: PointerEventInit): void {
    window.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

function noop(): void {
    /* intentional no-op */
}

function floatingWindow(id: string, extra?: Partial<ManagedWindow>): ManagedWindow {
    return {
        id,
        title: id,
        floating: true,
        itemRenderer: () => <div>{id} body</div>,
        ...extra,
    };
}

const DOCKED: ManagedWindow = {
    id: 'docked',
    title: 'Docked',
    itemRenderer: () => <div>Docked body</div>,
};

let playOneShot: ReturnType<typeof vi.fn<(event: SfxEvent) => void>>;

function renderWithSfx(ui: ReactNode) {
    return render(
        <SfxProvider playOneShot={playOneShot} play={vi.fn()} stop={vi.fn()}>
            {ui}
        </SfxProvider>,
    );
}

function windowEl(container: HTMLElement, id: string): HTMLDivElement | null {
    return container.querySelector<HTMLDivElement>(`[data-window-id="${id}"]`);
}

function rectOf(el: HTMLElement | null): ExpandedRect {
    const px = (name: string): number =>
        Number.parseFloat(el?.style.getPropertyValue(`--lib-window-${name}`) ?? 'NaN');
    return { x: px('x'), y: px('y'), w: px('w'), h: px('h') };
}

/** Owns the window list like an app would: `open` adds a floating window, close removes it. */
function Harness({ initial }: { initial: ManagedWindow[] }): ReactElement {
    const [windows, setWindows] = useState(initial);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    return (
        <>
            <button
                type="button"
                onClick={() =>
                    setWindows((prev) => [...prev, floatingWindow(`w${prev.length + 1}`)])
                }
            >
                open
            </button>
            <WindowManager
                windows={windows}
                assignments={{ docked: 'L1' }}
                onAssignmentsChange={noop}
                focusedId={focusedId}
                onFocusChange={setFocusedId}
                onClose={(id) => setWindows((prev) => prev.filter((w) => w.id !== id))}
            />
        </>
    );
}

beforeEach(() => {
    playOneShot = vi.fn<(event: SfxEvent) => void>();
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    Object.defineProperty(window, 'innerWidth', { value: VW, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: VH, writable: true, configurable: true });
    act(() => {
        window.dispatchEvent(new Event('resize'));
    });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('WindowManager — floating windows', () => {
    it('renders a floating window without an assignment, always expanded', () => {
        const { container } = renderWithSfx(
            <WindowManager
                windows={[floatingWindow('f1')]}
                assignments={{}}
                onAssignmentsChange={noop}
                modes={{ f1: 'compact' }}
            />,
        );
        expect(windowEl(container, 'f1')?.getAttribute('data-mode')).toBe('expanded');
        expect(screen.getByText('f1 body')).not.toBeNull();
    });

    it('still skips a docked window without an assignment', () => {
        const { container } = renderWithSfx(
            <WindowManager windows={[DOCKED]} assignments={{}} onAssignmentsChange={noop} />,
        );
        expect(windowEl(container, 'docked')).toBeNull();
    });

    it('opens centred below the top bar and cascades further windows', () => {
        const { container } = renderWithSfx(
            <WindowManager
                windows={[floatingWindow('f1'), floatingWindow('f2')]}
                assignments={{}}
                onAssignmentsChange={noop}
            />,
        );
        expect(rectOf(windowEl(container, 'f1'))).toEqual({ x: 400, y: 320, w: 480, h: 320 });
        expect(rectOf(windowEl(container, 'f2'))).toEqual({ x: 424, y: 344, w: 480, h: 320 });
    });

    it('uses defaultRect and reports it through onExpandedRectsChange', () => {
        const onExpandedRectsChange = vi.fn();
        const { container } = renderWithSfx(
            <WindowManager
                windows={[floatingWindow('f1', { defaultRect: { x: 40, y: 100, w: 300, h: 200 } })]}
                assignments={{}}
                onAssignmentsChange={noop}
                onExpandedRectsChange={onExpandedRectsChange}
            />,
        );
        expect(rectOf(windowEl(container, 'f1'))).toEqual({ x: 40, y: 100, w: 300, h: 200 });
        expect(onExpandedRectsChange).toHaveBeenCalledWith({
            f1: { x: 40, y: 100, w: 300, h: 200 },
        });
    });

    it('has no dock or reset button but a close button', () => {
        renderWithSfx(
            <WindowManager
                windows={[floatingWindow('f1')]}
                assignments={{}}
                onAssignmentsChange={noop}
                onClose={noop}
            />,
        );
        expect(screen.queryByRole('button', { name: 'Undock window' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Dock window' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Reset window' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Close window' })).not.toBeNull();
    });

    it('shows a close button on docked windows only when closable is set', () => {
        const { rerender } = renderWithSfx(
            <WindowManager
                windows={[DOCKED]}
                assignments={{ docked: 'L1' }}
                onAssignmentsChange={noop}
            />,
        );
        expect(screen.queryByRole('button', { name: 'Close window' })).toBeNull();
        rerender(
            <SfxProvider playOneShot={playOneShot} play={vi.fn()} stop={vi.fn()}>
                <WindowManager
                    windows={[{ ...DOCKED, closable: true }]}
                    assignments={{ docked: 'L1' }}
                    onAssignmentsChange={noop}
                />
            </SfxProvider>,
        );
        expect(screen.getByRole('button', { name: 'Close window' })).not.toBeNull();
    });

    it('resizes a floating window', () => {
        const { container } = renderWithSfx(
            <WindowManager
                windows={[floatingWindow('f1')]}
                assignments={{}}
                onAssignmentsChange={noop}
            />,
        );
        const handle = container.querySelector('[data-testid="resize-se"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 880, clientY: 640 });
        act(() => {
            windowPointerEvent('pointermove', { clientX: 940, clientY: 680 });
        });
        act(() => {
            windowPointerEvent('pointerup', { clientX: 940, clientY: 680 });
        });
        expect(rectOf(windowEl(container, 'f1'))).toEqual({ x: 400, y: 320, w: 540, h: 360 });
    });
});

describe('WindowManager — opening and closing at runtime', () => {
    it('opens any number of windows and plays menu_open for each new one', () => {
        const { container } = renderWithSfx(<Harness initial={[DOCKED]} />);
        expect(playOneShot).not.toHaveBeenCalledWith('menu_open');
        for (let i = 0; i < 12; i += 1) fireEvent.click(screen.getByText('open'));
        expect(container.querySelectorAll('[data-window-id^="w"]')).toHaveLength(12);
        expect(playOneShot.mock.calls.filter(([e]) => e === 'menu_open')).toHaveLength(12);
    });

    it('closes through the close button and plays menu_close', () => {
        const { container } = renderWithSfx(<Harness initial={[DOCKED]} />);
        fireEvent.click(screen.getByText('open'));
        fireEvent.click(screen.getByRole('button', { name: 'Close window' }));
        expect(windowEl(container, 'w2')).toBeNull();
        expect(playOneShot).toHaveBeenCalledWith('menu_close');
    });

    it('closes the focused floating window with Escape', () => {
        const { container } = renderWithSfx(<Harness initial={[]} />);
        fireEvent.click(screen.getByText('open'));
        const win = windowEl(container, 'w1');
        expect(win?.getAttribute('tabindex')).toBe('-1');
        fireEvent.keyDown(screen.getByText('w1 body'), { key: 'Escape' });
        expect(windowEl(container, 'w1')).toBeNull();
    });

    it('reopens a closed id at a fresh position', () => {
        const { container } = renderWithSfx(<Harness initial={[]} />);
        fireEvent.click(screen.getByText('open'));
        const handle = container.querySelector('[data-testid="window-drag-handle"]') as HTMLElement;
        fireEvent.pointerDown(handle, { button: 0, clientX: 500, clientY: 330 });
        act(() => {
            windowPointerEvent('pointermove', { clientX: 300, clientY: 430 });
        });
        act(() => {
            windowPointerEvent('pointerup', { clientX: 300, clientY: 430 });
        });
        expect(rectOf(windowEl(container, 'w1')).x).toBe(200);
        fireEvent.click(screen.getByRole('button', { name: 'Close window' }));
        fireEvent.click(screen.getByText('open'));
        expect(rectOf(windowEl(container, 'w1')).x).toBe(400);
    });

    it('brings the last used window to the front', () => {
        const { container } = renderWithSfx(<Harness initial={[]} />);
        fireEvent.click(screen.getByText('open'));
        fireEvent.click(screen.getByText('open'));
        const z = (id: string): string =>
            windowEl(container, id)?.style.getPropertyValue('--lib-window-z') ?? '';
        expect(Number(z('w2'))).toBeGreaterThan(Number(z('w1')));
        fireEvent.pointerDown(screen.getByText('w1 body'));
        expect(Number(z('w1'))).toBeGreaterThan(Number(z('w2')));
    });
});
