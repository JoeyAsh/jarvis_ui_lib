import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/**
 * Props of `PushToTalkButton`. All native `<button>` attributes (`disabled`, `id`,
 * `onPointerDown`, `onPointerUp`, `onKeyDown`, `data-*`, ...) are forwarded to the element.
 */
export interface PushToTalkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Whether the microphone is live; shows the pulse rings and a stronger glow, and sets
     * `aria-pressed`.
     * @default false
     */
    active?: boolean;
    /**
     * Called when the button is clicked, after the `click` sound plays. Handlers that take no
     * arguments (`() => void`) work as well.
     */
    onClick?: MouseEventHandler<HTMLButtonElement>;
    /**
     * Accessible name of the button, rendered as `aria-label`. Wins over the deprecated
     * `ariaLabel`.
     * @default 'Push to talk'
     */
    'aria-label'?: string;
    /**
     * Accessible name of the button.
     * @deprecated Use the standard `aria-label` attribute instead; `aria-label` wins when both are
     * set.
     */
    ariaLabel?: string;
    /** Extra classes for the root `<button>` element. */
    className?: string;
    /** Content of the button; replaces the default microphone icon when set. */
    children?: ReactNode;
}
