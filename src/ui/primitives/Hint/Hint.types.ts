import type { ReactNode } from 'react';

export interface HintKeyProps {
    /** Key or key combination to show, e.g. `SPACE` or `CTRL K`. */
    children: ReactNode;
    /** Additional class names for the `<kbd>` element. */
    className?: string;
}

export interface HintProps {
    /** Hint text, usually mixed with `Hint.Key` chips. */
    children: ReactNode;
    /** `fixed-br` pins the hint to the bottom-right corner of the viewport; `inline` keeps it in the flow. @default 'fixed-br' */
    position?: 'fixed-br' | 'inline';
    /** Additional class names for the root `<div>`. */
    className?: string;
}
