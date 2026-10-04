import type { HTMLAttributes, ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

/** Action button shown in a toast, e.g. `{ label: 'Undo', onClick: undo }`. */
export interface ToastAction {
    /** Button text, e.g. `Undo`. */
    label: string;
    /** Called when the action button is clicked. */
    onClick: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    /** Semantic color, icon and ARIA role (`error` uses `role="alert"`). @default 'info' */
    variant?: ToastVariant;
    /** Bold first line. */
    title?: ReactNode;
    /** Message text below the title. */
    description?: ReactNode;
    /** Optional action button, e.g. `{ label: 'Undo', onClick }`. */
    action?: ToastAction;
    /** Shows a close button that calls this handler. */
    onDismiss?: () => void;
    /**
     * Lifetime in ms; draws a countdown bar of that length. Omit or pass `Infinity` for no bar.
     * The toast does not close itself; `ToastProvider` handles timing.
     */
    duration?: number;
    /** Pauses the countdown bar (e.g. while hovered). @default false */
    paused?: boolean;
    /** Additional class names for the root element. */
    className?: string;
}
