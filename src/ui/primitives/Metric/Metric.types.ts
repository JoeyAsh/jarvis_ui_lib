import type { ReactNode } from 'react';

export interface MetricProps {
    /** The reading itself, rendered in tabular figures so changing digits do not shift the layout. */
    value: ReactNode;
    /** Unit shown after the value in a small muted `<small>`, e.g. `'%'`, `'ms'` or `'°C'`. */
    unit?: string;
    /** Colors the value in the warning color to flag an out-of-range reading. @default false */
    warn?: boolean;
    /** Renders the value at 12px instead of 14px for dense rows. @default false */
    small?: boolean;
    /** Additional class names for the root `<span>`. */
    className?: string;
}
