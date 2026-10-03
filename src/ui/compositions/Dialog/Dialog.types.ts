import type { ReactNode, RefObject } from 'react';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps {
    /** Whether the dialog is shown. The dialog is controlled. */
    open: boolean;
    /** Called with `false` when the user closes the dialog (Escape, backdrop, close button). */
    onOpenChange: (open: boolean) => void;
    /** Heading of the dialog; also its accessible name. */
    title: ReactNode;
    /** Hides the title visually while keeping it as the accessible name. @default false */
    hideTitle?: boolean;
    /** Optional text below the title; referenced by `aria-describedby`. */
    description?: ReactNode;
    /** Dialog body. */
    children?: ReactNode;
    /** Footer content, typically buttons, aligned to the right. */
    actions?: ReactNode;
    /** Maximum width: `sm` 360px, `md` 520px, `lg` 720px. @default 'md' */
    size?: DialogSize;
    /** Closes the dialog when the backdrop is clicked. @default true */
    closeOnBackdrop?: boolean;
    /** Shows the close button in the header. @default true */
    showClose?: boolean;
    /** Element that receives focus when the dialog opens. Defaults to the first focusable element. */
    initialFocusRef?: RefObject<HTMLElement | null>;
    /** Additional class names for the dialog panel. */
    className?: string;
}
