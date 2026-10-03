import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useSfx } from '@core/audio';
import { IconButton } from '../../primitives/IconButton';
import { CornerBrackets } from '../../primitives/CornerBrackets';
import { focusableIn } from './utils';
import type { DialogProps } from './Dialog.types';

const SIZE_CLASSES = {
    sm: 'max-w-[360px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[720px]',
} as const;

/**
 * Modal dialog rendered into `document.body`: traps focus, closes on Escape and backdrop click,
 * returns focus to the trigger and locks page scrolling while open.
 */
export function Dialog({
    open,
    onOpenChange,
    title,
    hideTitle = false,
    description,
    children,
    actions,
    size = 'md',
    closeOnBackdrop = true,
    showClose = true,
    initialFocusRef,
    className,
}: DialogProps): ReactElement | null {
    const baseId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const { playOneShot } = useSfx();

    useEffect(() => {
        if (!open) return undefined;
        const previouslyFocused =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        playOneShot('menu_open');

        const panel = panelRef.current;
        const target = initialFocusRef?.current ?? (panel ? focusableIn(panel)[0] : undefined);
        (target ?? panel)?.focus();

        return () => {
            document.body.style.overflow = overflow;
            playOneShot('menu_close');
            previouslyFocused?.focus();
        };
    }, [open, initialFocusRef, playOneShot]);

    if (!open) return null;

    function close(): void {
        onOpenChange(false);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
        if (e.key === 'Escape') {
            e.stopPropagation();
            close();
            return;
        }
        if (e.key !== 'Tab' || panelRef.current === null) return;
        const items = focusableIn(panelRef.current);
        const first = items[0];
        const last = items[items.length - 1];
        if (first === undefined || last === undefined) {
            e.preventDefault();
            return;
        }
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function handleBackdrop(e: MouseEvent<HTMLDivElement>): void {
        if (closeOnBackdrop && e.target === e.currentTarget) close();
    }

    const titleId = `${baseId}-title`;
    const descriptionId = `${baseId}-description`;

    return createPortal(
        <div
            role="presentation"
            className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-[rgba(5,5,8,0.72)] backdrop-blur-[4px] animate-[jlib-fade-in_200ms_ease-out_both] motion-reduce:animate-none"
            onMouseDown={handleBackdrop}
            onKeyDown={handleKeyDown}
        >
            <CornerBrackets className={cx('block w-full', SIZE_CLASSES[size])}>
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    aria-describedby={description === undefined ? undefined : descriptionId}
                    tabIndex={-1}
                    className={cx(
                        'flex max-h-[calc(100vh-32px)] flex-col font-mono text-text outline-none',
                        'border border-border rounded-[2px] bg-[rgba(13,13,20,0.94)] shadow-glow-inner',
                        'animate-[winIn_300ms_cubic-bezier(0.4,0,0.2,1)_both] motion-reduce:animate-none',
                        className,
                    )}
                >
                    <div
                        className={cx(
                            'flex items-start gap-3 px-4 pt-3',
                            hideTitle ? 'pb-0' : 'pb-3 border-b border-border',
                        )}
                    >
                        <div
                            className={cx(
                                'flex min-w-0 flex-1 flex-col gap-1',
                                hideTitle && 'sr-only',
                            )}
                        >
                            <h2
                                id={titleId}
                                className="m-0 text-[11px] font-medium uppercase tracking-[2px] text-accent-bright"
                            >
                                {title}
                            </h2>
                            {description !== undefined && (
                                <p
                                    id={descriptionId}
                                    className="m-0 text-[11px] text-text-secondary"
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {showClose && (
                            <IconButton
                                icon={X}
                                label="Close dialog"
                                size="sm"
                                className="ml-auto"
                                onClick={close}
                            />
                        )}
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[11px] leading-[1.7]">
                        {children}
                    </div>
                    {actions !== undefined && (
                        <div className="flex flex-wrap justify-end gap-2 border-t border-border px-4 py-3">
                            {actions}
                        </div>
                    )}
                </div>
            </CornerBrackets>
        </div>,
        document.body,
    );
}

export default Dialog;
