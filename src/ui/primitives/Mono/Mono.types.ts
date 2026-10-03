import type { ReactNode, ElementType, HTMLAttributes } from 'react';

export type MonoSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * Props of `Mono`. Native attributes (`id`, `title`, `aria-*`, `data-*`, event handlers, ...) are
 * forwarded to the rendered element, including the element given in `as`.
 */
export interface MonoProps extends HTMLAttributes<HTMLElement> {
    /** Text to render in the monospace font. */
    children: ReactNode;
    /** Font size step: `xs` 9px, `sm` 10px, `md` 11px, `lg` 13px. @default 'md' */
    size?: MonoSize;
    /** Additional class names for the rendered element. */
    className?: string;
    /** Element or component to render instead of a `<span>`, e.g. `'p'`, `'code'` or `'time'`. @default 'span' */
    as?: ElementType;
    /** Uses the muted text color; takes precedence over `secondary`. @default false */
    muted?: boolean;
    /** Uses the secondary text color instead of the primary one. @default false */
    secondary?: boolean;
    /** Machine-readable date or time, forwarded to the element; use it with `as="time"`. */
    dateTime?: string;
}
