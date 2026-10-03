import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Dialog } from '../Dialog';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
});

function Harness({ initialOpen = false }: { initialOpen?: boolean }): ReactElement {
    const [open, setOpen] = useState(initialOpen);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                open
            </button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Purge cache"
                description="This cannot be undone."
                actions={
                    <>
                        <button type="button" onClick={() => setOpen(false)}>
                            cancel
                        </button>
                        <button type="button">confirm</button>
                    </>
                }
            >
                <p>Body text</p>
            </Dialog>
        </>
    );
}

describe('Dialog', () => {
    it('renders nothing while closed', () => {
        render(<Harness />);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renders a labelled, described modal dialog into document.body', () => {
        render(<Harness initialOpen />);
        const dialog = screen.getByRole('dialog', { name: 'Purge cache' });
        expect(dialog.getAttribute('aria-modal')).toBe('true');
        expect(dialog.getAttribute('aria-describedby')).toBe(
            screen.getByText('This cannot be undone.').id,
        );
        expect(dialog.closest('body')).toBe(document.body);
    });

    it('focuses the first focusable element and returns focus on close', () => {
        render(<Harness />);
        const trigger = screen.getByRole('button', { name: 'open' });
        trigger.focus();
        fireEvent.click(trigger);
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close dialog' }));
        fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
        expect(screen.queryByRole('dialog')).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });

    it('focuses initialFocusRef when given', () => {
        function WithRef(): ReactElement {
            const ref = useRef<HTMLInputElement>(null);
            return (
                <Dialog open onOpenChange={() => undefined} title="Search" initialFocusRef={ref}>
                    <input ref={ref} aria-label="query" />
                </Dialog>
            );
        }
        render(<WithRef />);
        expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'query' }));
    });

    it('closes on Escape', () => {
        render(<Harness initialOpen />);
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('closes on backdrop click but not on clicks inside', () => {
        render(<Harness initialOpen />);
        fireEvent.mouseDown(screen.getByText('Body text'));
        expect(screen.queryByRole('dialog')).not.toBeNull();
        const backdrop = screen.getByRole('dialog').closest('[role="presentation"]');
        if (backdrop) fireEvent.mouseDown(backdrop);
        expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('closeOnBackdrop={false} keeps it open', () => {
        render(
            <Dialog open onOpenChange={() => undefined} title="Locked" closeOnBackdrop={false} />,
        );
        const backdrop = screen.getByRole('dialog').closest('[role="presentation"]');
        if (backdrop) fireEvent.mouseDown(backdrop);
        expect(screen.queryByRole('dialog')).not.toBeNull();
    });

    it('traps Tab focus inside the dialog', () => {
        render(<Harness initialOpen />);
        const dialog = screen.getByRole('dialog');
        const close = screen.getByRole('button', { name: 'Close dialog' });
        const confirm = screen.getByRole('button', { name: 'confirm' });
        confirm.focus();
        fireEvent.keyDown(dialog, { key: 'Tab' });
        expect(document.activeElement).toBe(close);
        fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(confirm);
    });

    it('locks page scrolling while open', () => {
        const { rerender } = render(<Dialog open onOpenChange={() => undefined} title="Scroll" />);
        expect(document.body.style.overflow).toBe('hidden');
        rerender(<Dialog open={false} onOpenChange={() => undefined} title="Scroll" />);
        expect(document.body.style.overflow).toBe('');
    });

    it('hideTitle keeps the accessible name and showClose={false} hides the button', () => {
        render(
            <Dialog
                open
                onOpenChange={() => undefined}
                title="Hidden"
                hideTitle
                showClose={false}
            />,
        );
        expect(screen.getByRole('dialog', { name: 'Hidden' })).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Close dialog' })).toBeNull();
    });

    it('applies size and className', () => {
        render(
            <Dialog open onOpenChange={() => undefined} title="Big" size="lg" className="extra" />,
        );
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('extra');
        expect(dialog.parentElement?.className).toContain('max-w-[720px]');
    });

    it('plays menu_open and menu_close', () => {
        const sfx: SfxContextValue = { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
        const { rerender } = render(
            <SfxContext.Provider value={sfx}>
                <Dialog open onOpenChange={() => undefined} title="Sfx" />
            </SfxContext.Provider>,
        );
        expect(sfx.playOneShot).toHaveBeenCalledWith('menu_open');
        rerender(
            <SfxContext.Provider value={sfx}>
                <Dialog open={false} onOpenChange={() => undefined} title="Sfx" />
            </SfxContext.Provider>,
        );
        expect(sfx.playOneShot).toHaveBeenCalledWith('menu_close');
    });
});
