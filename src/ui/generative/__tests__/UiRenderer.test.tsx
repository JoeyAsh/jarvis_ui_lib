import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createRef } from 'react';
import { UiRenderer } from '../UiRenderer';
import type { UiRendererHandle } from '../UiRenderer';
import type { UiWindowSpec } from '../spec.types';

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
});

afterEach(() => {
    vi.restoreAllMocks();
});

const VOLUME: UiWindowSpec = {
    id: 'volume',
    state: { volume: 40, muted: false },
    root: {
        type: 'Stack',
        children: [
            {
                type: 'Slider',
                props: { label: 'Volume', value: { $bind: 'volume' }, formatValue: '{value} %' },
            },
            { type: 'Switch', props: { label: 'Mute', checked: { $bind: 'muted' } } },
            {
                type: 'Mono',
                children: 'Volume {{volume}} %',
                visibleIf: { state: 'muted', eq: false },
            },
            { type: 'Pill', children: 'Muted', visibleIf: { state: 'muted' } },
            {
                type: 'Button',
                children: 'Apply',
                on: { onClick: [{ emit: 'apply', payload: { $state: 'volume' } }] },
            },
            {
                type: 'Button',
                children: 'Reset',
                on: { onClick: [{ set: 'volume', value: 0 }, { toggle: 'muted' }] },
            },
        ],
    },
};

describe('UiRenderer', () => {
    it('renders components with templates, formatted values and visibleIf', () => {
        render(<UiRenderer spec={VOLUME} />);
        expect(screen.getByRole('slider', { name: 'Volume' }).getAttribute('aria-valuetext')).toBe(
            '40 %',
        );
        expect(screen.getByText('Volume 40 %')).toBeDefined();
        expect(screen.queryByText('Muted')).toBeNull();
    });

    it('two-way bindings update the state and everything that reads it', () => {
        const onStateChange = vi.fn();
        render(<UiRenderer spec={VOLUME} onStateChange={onStateChange} />);
        fireEvent.keyDown(screen.getByRole('slider', { name: 'Volume' }), { key: 'ArrowRight' });
        expect(screen.getByText('Volume 41 %')).toBeDefined();
        fireEvent.click(screen.getByRole('switch', { name: 'Mute' }));
        expect(screen.getByText('Muted')).toBeDefined();
        expect(screen.queryByText(/Volume \d+ %/)).toBeNull();
        expect(onStateChange).toHaveBeenLastCalledWith({ volume: 41, muted: true });
    });

    it('runs set, toggle and emit actions', () => {
        const onAction = vi.fn();
        render(<UiRenderer spec={VOLUME} onAction={onAction} />);
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }));
        expect(onAction).toHaveBeenCalledWith({ windowId: 'volume', name: 'apply', payload: 40 });
        fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
        expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('0');
        expect(screen.getByText('Muted')).toBeDefined();
    });

    it('follows a controlled state', () => {
        const { rerender } = render(
            <UiRenderer spec={VOLUME} state={{ volume: 10, muted: false }} />,
        );
        expect(screen.getByText('Volume 10 %')).toBeDefined();
        rerender(<UiRenderer spec={VOLUME} state={{ volume: 20, muted: false }} />);
        expect(screen.getByText('Volume 20 %')).toBeDefined();
    });

    it('renders placeholders for unknown components and reports errors', () => {
        const onError = vi.fn();
        render(
            <UiRenderer
                spec={{
                    id: 'bad',
                    root: {
                        type: 'Stack',
                        children: [{ type: 'Nope' }, { type: 'Pill', children: 'still here' }],
                    },
                }}
                onError={onError}
            />,
        );
        expect(screen.getByText('Unknown component "Nope"')).toBeDefined();
        expect(screen.getByText('still here')).toBeDefined();
        expect(onError).toHaveBeenCalledWith([
            { path: '$.root.children[0].type', message: 'unknown component "Nope"' },
        ]);
    });

    it('drops props that are not allowed or unsafe', () => {
        const { container } = render(
            <UiRenderer
                spec={{
                    id: 'x',
                    root: {
                        type: 'Stack',
                        children: [
                            {
                                type: 'Link',
                                props: { href: 'javascript:alert(1)', className: 'hacked' },
                                children: 'bad',
                            },
                            {
                                type: 'Link',
                                props: { href: 'https://example.com' },
                                children: 'ok',
                            },
                        ],
                    },
                }}
            />,
        );
        expect(screen.getByText('bad').closest('a')?.getAttribute('href')).toBeNull();
        expect(screen.getByText('ok').closest('a')?.getAttribute('href')).toBe(
            'https://example.com',
        );
        expect(container.querySelector('.hacked')).toBeNull();
    });

    it('maps icons, nodes in props, tables and tabs', () => {
        render(
            <UiRenderer
                spec={{
                    id: 'x',
                    root: {
                        type: 'Stack',
                        children: [
                            { type: 'IconButton', props: { icon: 'Play', label: 'Play it' } },
                            {
                                type: 'Callout',
                                props: { title: { type: 'Pill', children: 'NEW' } },
                                children: 'Body',
                            },
                            {
                                type: 'Table',
                                props: {
                                    caption: 'Log',
                                    columns: [
                                        { key: 'time', header: 'Time' },
                                        { key: 'msg', header: 'Message' },
                                    ],
                                    rows: [{ id: 1, time: '10:00', msg: 'Boot' }],
                                },
                            },
                            {
                                type: 'Tabs',
                                props: {
                                    'aria-label': 'Views',
                                    items: [
                                        { value: 'a', label: 'Alpha', content: 'First tab' },
                                        {
                                            value: 'b',
                                            label: 'Beta',
                                            content: { type: 'Pill', children: 'Second tab' },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                }}
            />,
        );
        expect(screen.getByRole('button', { name: 'Play it' }).querySelector('svg')).not.toBeNull();
        expect(screen.getByText('NEW')).toBeDefined();
        expect(screen.getByRole('cell', { name: 'Boot' })).toBeDefined();
        expect(screen.getByText('First tab')).toBeDefined();
        fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
        expect(screen.getByText('Second tab')).toBeDefined();
    });

    it('calls player methods on nodes with an id', () => {
        const pause = vi
            .spyOn(HTMLMediaElement.prototype, 'pause')
            .mockImplementation(() => undefined);
        const ref = createRef<UiRendererHandle>();
        const { container } = render(
            <UiRenderer
                ref={ref}
                spec={{
                    id: 'x',
                    root: { type: 'MediaPlayer', id: 'player', props: { src: 'clip.mp4' } },
                }}
            />,
        );
        let ok = false;
        act(() => {
            ok = ref.current?.call('player', 'seek', 42) ?? false;
        });
        expect(ok).toBe(true);
        expect(container.querySelector('video')?.currentTime).toBe(42);
        act(() => {
            ref.current?.call('player', 'pause');
        });
        expect(pause).toHaveBeenCalled();
        expect(ref.current?.call('nope', 'pause')).toBe(false);
        expect(ref.current?.call('player', 'seek', 'soon')).toBe(false);
    });
});
