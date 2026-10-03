import type { ReactNode } from 'react';

export interface GlowFrameProps {
    /** Content inside the glowing frame. */
    children: ReactNode;
    /** Pulses the glow in a slow loop; under `prefers-reduced-motion: reduce` the static glow is shown instead. @default false */
    breathe?: boolean;
    /** Uses the stronger `--glow-strong` halo instead of `--glow` for the static glow (also the reduced-motion fallback of `breathe`). @default false */
    strong?: boolean;
    /** Additional class names for the frame `<div>`, e.g. padding. */
    className?: string;
}
