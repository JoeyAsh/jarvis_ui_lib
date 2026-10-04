import type { ReactElement, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Props the tooltip injects into its trigger element. */
export interface TooltipTriggerProps {
    /** Id of the tooltip bubble while it is open, so screen readers announce it. */
    'aria-describedby'?: string;
}

export interface TooltipProps {
    /** Text or content shown in the tooltip bubble. */
    content: ReactNode;
    /** The trigger: a single element. It receives `aria-describedby` while the tooltip is open. */
    children: ReactElement<TooltipTriggerProps>;
    /** Side of the trigger the tooltip appears on. @default 'top' */
    placement?: TooltipPlacement;
    /** Delay in ms before the tooltip opens on hover. Keyboard focus opens it immediately. @default 300 */
    delayMs?: number;
    /** Disables the tooltip without removing it from the tree. @default false */
    disabled?: boolean;
    /** Additional class names for the tooltip bubble (`role="tooltip"`), not the trigger wrapper. */
    className?: string;
}
