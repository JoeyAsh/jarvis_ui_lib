import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useLayoutEffect } from 'react';
import type { ReactElement } from 'react';
import { WindowManager } from '../../compositions/WindowManager';
import { useUiWindows } from '../useUiWindows';
import type { UseUiWindowsResult } from '../useUiWindows.types';
import type { UiActionEvent } from '../spec.types';

const VOLUME = {
    id: 'volume',
    title: 'Volume',
    size: { w: 300, h: 200 },
    state: { volume: 40 },
    root: {
        type: 'Stack',
        children: [
            { type: 'Slider', props: { label: 'Volume', value: { $bind: 'volume' } } },
            { type: 'Button', children: 'Apply', on: { onClick: { emit: 'apply' } } },
        ],
    },
};

const NOTES = {
    id: 'notes',
    title: 'Notes',
    state: { text: '' },
    root: { type: 'Mono', children: 'Notes: {{text}}' },
};

/** Latest hook result, published from an effect so tests can drive the hook. */
const holder: { api: UseUiWindowsResult | null } = { api: null };

function Harness({ onAction }: { onAction: (e: UiActionEvent) => void }): ReactElement {
    const ui = useUiWindows({ onAction });
    useLayoutEffect(() => {
        holder.api = ui;
    });
    return (
        <WindowManager
            windows={ui.windows}
            assignments={{}}
            onAssignmentsChange={() => undefined}
            onClose={ui.onClose}
        />
    );
}

function current(): UseUiWindowsResult {
    if (holder.api === null) throw new Error('not mounted');
    return holder.api;
}

beforeEach(() => {
    holder.api = null;
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('useUiWindows', () => {
    it('opens several windows, each with its own state and size', () => {
        const { container } = render(<Harness onAction={vi.fn()} />);
        act(() => {
            expect(current().open(VOLUME).ok).toBe(true);
            expect(current().open(NOTES).ok).toBe(true);
        });
        expect(screen.getByRole('region', { name: 'Volume' })).toBeDefined();
        expect(screen.getByText('Notes:')).toBeDefined();
        const win = container.querySelector<HTMLElement>('[data-window-id="volume"]');
        expect(win?.style.getPropertyValue('--lib-window-w')).toBe('300px');
        expect(current().entries.map((e) => e.spec.id)).toEqual(['volume', 'notes']);
    });

    it('patches a window state without rebuilding it', () => {
        render(<Harness onAction={vi.fn()} />);
        act(() => {
            current().open(VOLUME);
            current().open(NOTES);
        });
        const slider = screen.getByRole('slider', { name: 'Volume' });
        act(() => {
            expect(current().patchState('volume', { volume: 20 })).toBe(true);
            current().patchState('notes', { text: 'hello' });
        });
        expect(screen.getByRole('slider', { name: 'Volume' })).toBe(slider);
        expect(slider.getAttribute('aria-valuenow')).toBe('20');
        expect(screen.getByText('Notes: hello')).toBeDefined();
        expect(current().getState('volume')).toEqual({ volume: 20 });
        expect(current().patchState('nope', {})).toBe(false);
    });

    it('keeps user input in the state and forwards emits with the window id', () => {
        const onAction = vi.fn();
        render(<Harness onAction={onAction} />);
        act(() => {
            current().open(VOLUME);
        });
        fireEvent.keyDown(screen.getByRole('slider', { name: 'Volume' }), { key: 'ArrowUp' });
        expect(current().getState('volume')).toEqual({ volume: 41 });
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
        expect(onAction).toHaveBeenCalledWith({
            windowId: 'volume',
            name: 'apply',
            payload: undefined,
        });
    });

    it('rejects invalid specs, replaces by id and closes', () => {
        render(<Harness onAction={vi.fn()} />);
        let result = { ok: true, errors: [] as { path: string; message: string }[] };
        act(() => {
            result = current().open({ id: 'bad', root: { type: 'ThreeOrb' } });
        });
        expect(result.ok).toBe(false);
        expect(current().entries).toHaveLength(0);
        act(() => {
            current().open(VOLUME);
            current().open({ ...VOLUME, title: 'Lautstärke' });
        });
        expect(current().entries).toHaveLength(1);
        expect(screen.getByRole('region', { name: 'Lautstärke' })).toBeDefined();
        fireEvent.click(screen.getByRole('button', { name: 'Close window' }));
        expect(current().entries).toHaveLength(0);
    });
});
