import type { ReactNode } from 'react';

export interface PushToTalkButtonProps {
    /**
     * Whether the microphone is live; shows the pulse rings and a stronger glow, and sets
     * `aria-pressed`.
     * @default false
     */
    active?: boolean;
    /** Called when the button is clicked (after the `click` sound); receives no arguments. */
    onClick?: () => void;
    /**
     * Accessible name of the button, rendered as `aria-label`.
     * @default 'Push to talk'
     */
    ariaLabel?: string;
    /** Extra classes for the root `<button>` element. */
    className?: string;
    /** Content of the button; replaces the default microphone icon when set. */
    children?: ReactNode;
}
