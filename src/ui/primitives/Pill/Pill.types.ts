import type { HTMLAttributes, ReactNode } from 'react';

export type PillVariant = 'default' | 'ok' | 'warn' | 'err' | 'info';

/**
 * Props of `Pill`. Native attributes (`id`, `title`, `aria-*`, `data-*`, event handlers, ...) are
 * forwarded to the root `<span>`.
 */
export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
    /** Short status text shown inside the pill; rendered uppercase. */
    children: ReactNode;
    /** Status color of the text and border: neutral, success, warning, error or accent. @default 'default' */
    variant?: PillVariant;
    /** Additional class names for the root `<span>`. */
    className?: string;
}
