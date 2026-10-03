import type { ReactNode } from 'react';

export interface GlowFrameProps {
    /** Content inside the glowing frame. */
    children: ReactNode;
    /** Pulses the glow in a slow loop instead of showing a static glow. @default false */
    breathe?: boolean;
    /** Uses the stronger `--glow-strong` halo instead of `--glow` for the static glow. @default false */
    strong?: boolean;
    /** Additional class names for the frame `<div>`, e.g. padding. */
    className?: string;
}
