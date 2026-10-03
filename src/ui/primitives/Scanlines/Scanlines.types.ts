import type { ReactNode } from 'react';

export interface ScanlinesProps {
    /** Content rendered underneath the scanline overlay. */
    children: ReactNode;
    /** Additional class names for the wrapper `<div>` (relative, overflow hidden), e.g. border and padding. */
    className?: string;
    /** Adds a light band that sweeps horizontally across the content in a loop. @default false */
    sweep?: boolean;
}
