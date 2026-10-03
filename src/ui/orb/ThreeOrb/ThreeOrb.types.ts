import type { AppOrbState } from '@common/types';

export interface ThreeOrbProps {
    /** Orb state the particle animation transitions to; `working` is shown as `thinking`. */
    state: AppOrbState;
    /** Extra classes for the `<canvas>` element (fixed, top-left, viewport-sized). */
    className?: string;
}
