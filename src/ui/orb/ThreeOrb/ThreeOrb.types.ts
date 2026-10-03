import type { AppOrbState } from '@common/types';

export interface ThreeOrbProps {
    /** Orb state the particle animation transitions to; `working` is shown as `thinking`. */
    state: AppOrbState;
    /** Extra classes for the `<canvas>` element (fixed, top-left, viewport-sized). */
    className?: string;
    /**
     * Accessible name for the orb. When set, the canvas gets `role="img"` and this label; when
     * omitted, the canvas is decorative (`aria-hidden="true"`).
     */
    'aria-label'?: string;
}
