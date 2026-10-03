import type { ReactNode } from 'react';

export interface LabelProps {
    /** Caption text; rendered small and uppercase. */
    children: ReactNode;
    /** Uses the muted text color instead of the secondary one, for less important captions. @default false */
    dim?: boolean;
    /** Additional class names for the root element (`<label>` or `<span>`). */
    className?: string;
    /** Id of a form control; when set, the label renders as a native `<label>` bound to it, otherwise as a `<span>`. */
    htmlFor?: string;
}
