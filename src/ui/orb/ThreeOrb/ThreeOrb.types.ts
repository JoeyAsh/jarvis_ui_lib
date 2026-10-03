import type { AppOrbState } from '@common/types';
import type { OrbQuality, OrbVariant } from '../variants';

/** `constellation` is the original particle-and-lines orb; the others are the variant designs. */
export type ThreeOrbVariant = 'constellation' | OrbVariant;

/** `viewport`: fixed, full-screen canvas behind the UI. `container`: fills the parent element. */
export type ThreeOrbFill = 'viewport' | 'container';

export interface ThreeOrbProps {
    /** Assistant state the orb animates to. Each design maps the states it doesn't have itself. */
    state: AppOrbState;
    /**
     * Visual design. `constellation` is the original orb; `particle`, `halo`, `signal`, `reactor`
     * and `lattice` are lazily loaded on first use. @default 'constellation'
     */
    variant?: ThreeOrbVariant;
    /**
     * Render quality of the variant designs: `low` uses fewer particles, pixel ratio 1 and
     * half-resolution bloom for weak GPUs. Ignored by `constellation`. @default 'high'
     */
    quality?: OrbQuality;
    /**
     * Lets the user rotate (drag) and zoom (scroll) the variant designs. Ignored by
     * `constellation`. @default false
     */
    interactive?: boolean;
    /**
     * Audio source, e.g. a microphone or TTS `AnalyserNode`; drives level and frequency bands.
     * Without it, the variant designs use a simulated voice in `listening` and `speaking`.
     */
    analyser?: AnalyserNode | null;
    /** Where the orb renders: the whole viewport behind the UI, or its parent element. @default 'viewport' */
    fill?: ThreeOrbFill;
    /** Additional class names for the root element (the canvas for `constellation` in the viewport). */
    className?: string;
    /**
     * Accessible name for the orb. When set, the root gets `role="img"` and this label; when
     * omitted, the orb is decorative (`aria-hidden="true"`).
     */
    'aria-label'?: string;
}
