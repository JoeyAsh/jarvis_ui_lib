import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Props of `Label`. Native attributes (`id`, `title`, `aria-*`, `data-*`, event handlers, ...) are
 * forwarded to the root element, so a `<span>` label can name a region via `aria-labelledby`.
 */
export interface LabelProps extends HTMLAttributes<HTMLElement> {
    /** Caption text; rendered small and uppercase. */
    children: ReactNode;
    /** Uses the muted text color instead of the secondary one, for less important captions. @default false */
    dim?: boolean;
    /** Additional class names for the root element (`<label>` or `<span>`). */
    className?: string;
    /** Id of a form control; when set, the label renders as a native `<label>` bound to it, otherwise as a `<span>`. */
    htmlFor?: string;
}
