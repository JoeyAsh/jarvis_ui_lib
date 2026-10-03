import type { AppOrbState } from '@common/types';

export interface CssOrbProps {
    /** Orb state: sets the core animation, the listening pulses and the amber `working` recolor. */
    state: AppOrbState;
    /**
     * Draws the five concentric rings and the rotating tick ring around the core.
     * @default true
     */
    rings?: boolean;
    /**
     * Draws six particles orbiting the core, animated with `requestAnimationFrame`. Under
     * `prefers-reduced-motion: reduce` the frame loop does not run and the particles stay still.
     * @default true
     */
    particles?: boolean;
    /** Extra classes for the root `<div>` element (the centred anchor of the orb). */
    className?: string;
    /**
     * Accessible name for the orb. When set, the root gets `role="img"` and this label; when
     * omitted, the whole orb is decorative (`aria-hidden="true"`).
     */
    'aria-label'?: string;
}

/** Orbit settings of one CssOrb particle. */
export interface ParticleConfig {
    /** Orbit radius in pixels. */
    radius: number;
    /** Orbit direction: `1` clockwise, `-1` counter-clockwise. */
    dir: 1 | -1;
    /** Seconds per revolution. */
    period: number;
    /** Start angle in radians. */
    phase: number;
    /** Diameter in pixels. */
    size: number;
    /** CSS custom property used as the particle color, e.g. `--accent`. */
    colorVar: string;
}
