/**
 * Window lib primitive — SFX integration tests (Vitest + RTL).
 *
 * Verifies:
 *   - hover_panel does NOT fire directly from Window root (Panel owns that)
 *   - Reset button click → click + recall
 *   - ModeToggle button click (compact) → click + expand
 *   - ModeToggle button click (expanded) → click + collapse
 *   - Close button click → click
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Window } from '../Window';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';
import type { SfxEvent } from '@core/audio';

type MockFn = ReturnType<typeof vi.fn> & ((event: SfxEvent) => void);

function makeSfx(): { playOneShot: MockFn; play: MockFn; stop: MockFn } & SfxContextValue {
    return { playOneShot: vi.fn() as MockFn, play: vi.fn() as MockFn, stop: vi.fn() as MockFn };
}

const defaultPosition = { x: 0, y: 0, w: 400, h: 300 };

function renderWindow(
    sfx: SfxContextValue,
    props: Partial<React.ComponentProps<typeof Window>> = {},
) {
    const mergedProps = {
        id: 'test-win',
        position: defaultPosition,
        itemRenderer: () => <div>content</div>,
        ...props,
    };
    return render(
        <SfxContext.Provider value={sfx}>
            <Window {...mergedProps} />
        </SfxContext.Provider>,
    );
}

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
});

describe('Window — SFX', () => {
    it('does NOT fire hover_panel directly from Window root mouseenter (Panel owns that)', () => {
        const sfx = makeSfx();
        const { container } = renderWindow(sfx);
        const root = container.querySelector('.lib-window');
        if (root) fireEvent.mouseEnter(root);
        const hoverPanelCalls = (sfx.playOneShot as ReturnType<typeof vi.fn>).mock.calls.filter(
            (c) => c[0] === 'hover_panel',
        );
        // Window root has no onMouseEnter for hover_panel — Panel's handler owns it.
        // fireEvent.mouseEnter on the Window root div does not propagate into Panel's handler,
        // so no hover_panel call should originate from this event.
        expect(hoverPanelCalls).toHaveLength(0);
    });

    it('Reset button click fires click + recall', () => {
        const sfx = makeSfx();
        const onReset = vi.fn();
        renderWindow(sfx, { onReset });
        const resetBtn = screen.getByRole('button', { name: /reset window/i });
        fireEvent.click(resetBtn);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
        expect(sfx.playOneShot).toHaveBeenCalledWith('recall');
    });

    it('ModeToggle click in compact mode fires click + expand', () => {
        const sfx = makeSfx();
        const onModeToggle = vi.fn();
        renderWindow(sfx, { onModeToggle, mode: 'compact' });
        const modeBtn = screen.getByRole('button', { name: /undock window/i });
        fireEvent.click(modeBtn);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
        expect(sfx.playOneShot).toHaveBeenCalledWith('expand');
    });

    it('ModeToggle click in expanded mode fires click + collapse', () => {
        const sfx = makeSfx();
        const onModeToggle = vi.fn();
        renderWindow(sfx, { onModeToggle, mode: 'expanded' });
        const modeBtn = screen.getByRole('button', { name: /dock window/i });
        fireEvent.click(modeBtn);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
        expect(sfx.playOneShot).toHaveBeenCalledWith('collapse');
    });

    it('Close button click fires click', () => {
        const sfx = makeSfx();
        const onClose = vi.fn();
        renderWindow(sfx, { onClose });
        const closeBtn = screen.getByRole('button', { name: /close window/i });
        fireEvent.click(closeBtn);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('header buttons have data-sfx-hover="button"', () => {
        const sfx = makeSfx();
        const onClose = vi.fn();
        const onReset = vi.fn();
        const onModeToggle = vi.fn();
        const { container } = renderWindow(sfx, {
            onClose,
            onReset,
            onModeToggle,
            mode: 'compact',
        });
        const sfxButtons = container.querySelectorAll('.lib-window__btn[data-sfx-hover="button"]');
        expect(sfxButtons.length).toBeGreaterThanOrEqual(3);
    });
});

describe('Window — visual', () => {
    it('renders with data-window-id', () => {
        const { container } = renderWindow(makeSfx());
        expect(container.querySelector('[data-window-id="test-win"]')).not.toBeNull();
    });

    it('renders resize handles when resizable=true', () => {
        const { container } = renderWindow(makeSfx(), { resizable: true });
        expect(container.querySelector('[data-testid="resize-se"]')).not.toBeNull();
    });

    it('does not render resize handles when resizable=false', () => {
        const { container } = renderWindow(makeSfx(), { resizable: false });
        expect(container.querySelector('[data-testid="resize-se"]')).toBeNull();
    });

    it('renders drag handle', () => {
        renderWindow(makeSfx());
        expect(screen.getByTestId('window-drag-handle')).toBeDefined();
    });

    it('renders close button when onClose is provided', () => {
        renderWindow(makeSfx(), { onClose: vi.fn() });
        expect(screen.getByRole('button', { name: /close window/i })).toBeDefined();
    });

    it('does not render close button when onClose is not provided', () => {
        renderWindow(makeSfx());
        expect(screen.queryByRole('button', { name: /close window/i })).toBeNull();
    });
});

describe('Window — header double-click', () => {
    it('toggles the mode and plays expand (no click) in compact mode', () => {
        const sfx = makeSfx();
        const onModeToggle = vi.fn();
        renderWindow(sfx, { onModeToggle, mode: 'compact', title: 'Alpha' });
        const handle = screen.getByTestId('window-drag-handle');
        fireEvent.click(handle);
        fireEvent.click(handle);
        expect(onModeToggle).toHaveBeenCalledTimes(1);
        expect(onModeToggle).toHaveBeenCalledWith('test-win');
        expect(sfx.playOneShot).toHaveBeenCalledWith('expand');
        expect(sfx.playOneShot).not.toHaveBeenCalledWith('click');
    });

    it('plays collapse when double-clicked in expanded mode', () => {
        const sfx = makeSfx();
        const onModeToggle = vi.fn();
        renderWindow(sfx, { onModeToggle, mode: 'expanded', title: 'Alpha' });
        const handle = screen.getByTestId('window-drag-handle');
        fireEvent.click(handle);
        fireEvent.click(handle);
        expect(onModeToggle).toHaveBeenCalledTimes(1);
        expect(sfx.playOneShot).toHaveBeenCalledWith('collapse');
    });

    it('a single click neither toggles nor plays a sound', () => {
        const sfx = makeSfx();
        const onModeToggle = vi.fn();
        renderWindow(sfx, { onModeToggle });
        fireEvent.click(screen.getByTestId('window-drag-handle'));
        expect(onModeToggle).not.toHaveBeenCalled();
        expect(sfx.playOneShot).not.toHaveBeenCalled();
    });

    it('plays no sound on double-click without onModeToggle', () => {
        const sfx = makeSfx();
        renderWindow(sfx);
        const handle = screen.getByTestId('window-drag-handle');
        fireEvent.click(handle);
        fireEvent.click(handle);
        expect(sfx.playOneShot).not.toHaveBeenCalled();
    });
});

describe('Window — accessibility', () => {
    it('is a region labelled by its title element', () => {
        renderWindow(makeSfx(), { title: 'Telemetry' });
        const region = screen.getByRole('region', { name: 'Telemetry' });
        const labelId = region.getAttribute('aria-labelledby');
        expect(labelId).toBeTruthy();
        expect(document.getElementById(labelId ?? '')?.textContent).toBe('Telemetry');
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('is named by a non-string title too', () => {
        renderWindow(makeSfx(), { title: <strong>Systems</strong> });
        expect(screen.getByRole('region', { name: 'Systems' })).toBeDefined();
    });

    it('omits aria-labelledby without a title', () => {
        const { container } = renderWindow(makeSfx());
        expect(container.querySelector('.lib-window')?.hasAttribute('aria-labelledby')).toBe(false);
    });
});

describe('Window — geometry and styling', () => {
    it('injects the position as CSS variables instead of raw inline geometry', () => {
        const { container } = renderWindow(makeSfx(), {
            position: { x: 10, y: 20, w: 300, h: 200 },
        });
        const root = container.querySelector<HTMLDivElement>('.lib-window');
        expect(root?.style.getPropertyValue('--lib-window-x')).toBe('10px');
        expect(root?.style.getPropertyValue('--lib-window-y')).toBe('20px');
        expect(root?.style.getPropertyValue('--lib-window-w')).toBe('300px');
        expect(root?.style.getPropertyValue('--lib-window-h')).toBe('200px');
        expect(root?.style.left).toBe('');
    });

    it('renders ix and title with classes, not inline styles', () => {
        const { container } = renderWindow(makeSfx(), { ix: '01', title: 'Alpha' });
        const ix = container.querySelector<HTMLElement>('.lib-window__ix');
        const title = container.querySelector<HTMLElement>('.lib-window__title');
        expect(ix?.textContent).toBe('01');
        expect(ix?.getAttribute('style')).toBeNull();
        expect(title?.getAttribute('style')).toBeNull();
        expect(container.querySelector('.lib-panel')?.getAttribute('style')).toBeNull();
    });

    it('merges className onto the root', () => {
        const { container } = renderWindow(makeSfx(), { className: 'extra' });
        expect(container.querySelector('.lib-window.extra')).not.toBeNull();
    });
});

describe('Window — gesture callbacks', () => {
    it('passes the native PointerEvent to onDragStart', () => {
        const onDragStart = vi.fn();
        renderWindow(makeSfx(), { onDragStart });
        fireEvent.pointerDown(screen.getByTestId('window-drag-handle'), {
            button: 0,
            clientX: 5,
            clientY: 5,
        });
        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart.mock.calls[0]?.[0]).toBe('test-win');
        expect(onDragStart.mock.calls[0]?.[1]).toBeInstanceOf(PointerEvent);
        fireEvent.pointerUp(window, { clientX: 5, clientY: 5 });
    });

    it('passes the direction and native PointerEvent to onResizeStart', () => {
        const onResizeStart = vi.fn();
        renderWindow(makeSfx(), { onResizeStart, mode: 'expanded' });
        fireEvent.pointerDown(screen.getByTestId('resize-se'), {
            button: 0,
            clientX: 5,
            clientY: 5,
        });
        expect(onResizeStart).toHaveBeenCalledTimes(1);
        expect(onResizeStart.mock.calls[0]?.[1]).toBe('se');
        expect(onResizeStart.mock.calls[0]?.[2]).toBeInstanceOf(PointerEvent);
        fireEvent.pointerUp(window, { clientX: 5, clientY: 5 });
    });
});
