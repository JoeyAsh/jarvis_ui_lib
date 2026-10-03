import type { ReactNode } from 'react';

export interface CornerBracketsProps {
    /** Brightens the brackets to `--accent-bright` at full opacity; changes fade over 200ms. @default false */
    focused?: boolean;
    /** Length of each bracket arm in pixels (injected as `--cb-size` on the wrapper). @default 12 */
    size?: number;
    /** Additional class names for the relative wrapper `<div>`, e.g. padding to move the brackets away from the content. */
    className?: string;
    /** Content framed by the brackets; the brackets sit 2px outside the wrapper's edges. */
    children?: ReactNode;
}
