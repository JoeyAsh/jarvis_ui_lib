import type { ReactNode } from 'react';
import type { ToastAction, ToastVariant } from '../../primitives/Toast';

export type ToastPlacement = 'bottom-right' | 'top-right' | 'bottom-center' | 'top-center';

export interface ToastOptions {
    /** Bold first line. */
    title?: ReactNode;
    /** Message text below the title. */
    description?: ReactNode;
    /** Semantic color, icon and sound (`success` plays `confirm`, `error` plays `error`). @default 'info' */
    variant?: ToastVariant;
    /** Time in ms before the toast closes itself; `Infinity` keeps it until dismissed. @default 5000 */
    duration?: number;
    /** Optional action button; clicking it also dismisses the toast. */
    action?: ToastAction;
    /** Reuse an id to replace a visible toast instead of stacking a new one (e.g. "Copied"). */
    id?: string;
}

export interface ToastApi {
    /** Shows a toast and returns its id. */
    toast: (options: ToastOptions) => string;
    /** Closes the toast with this id. */
    dismiss: (id: string) => void;
    /** Closes all toasts, including queued ones. */
    dismissAll: () => void;
}

export interface ToastProviderProps {
    /** The app (or part of it) that may call `useToast()`. */
    children: ReactNode;
    /** Screen corner or edge the toasts stack at. @default 'bottom-right' */
    placement?: ToastPlacement;
    /** Maximum number of toasts shown at once; further toasts wait in a queue. @default 3 */
    max?: number;
    /** Default lifetime in ms for toasts without their own `duration`. @default 5000 */
    duration?: number;
    /** Accessible name of the notification region. @default 'Notifications' */
    label?: string;
}

/** A toast as stored by the provider. */
export interface ToastRecord extends ToastOptions {
    id: string;
    /** Changes when a toast is replaced through its id, so its timer restarts. */
    version: number;
}

export interface ToastItemProps {
    record: ToastRecord;
    /** Lifetime used when the record has no own duration. */
    defaultDuration: number;
    onDismiss: (id: string) => void;
}
