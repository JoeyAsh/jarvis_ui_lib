import type { ReactNode } from 'react';

/** Placement of a `Hint`: pinned to the bottom-right viewport corner, or in the document flow. */
export type HintPosition = 'fixed-br' | 'inline';

export interface HintKeyProps {
    /** Key or key combination to show, e.g. `SPACE` or `CTRL K`. */
    children: ReactNode;
    /** Additional class names for the `<kbd>` element (a small `Kbd` chip). */
    className?: string;
}

export interface HintProps {
    /** Hint text, usually mixed with `Hint.Key` chips. */
    children: ReactNode;
    /** `fixed-br` pins the hint to the bottom-right corner of the viewport (class `lib-hint--fixed-br`); `inline` keeps it in the flow. @default 'fixed-br' */
    position?: HintPosition;
    /** Additional class names for the root `<div>`. */
    className?: string;
}
