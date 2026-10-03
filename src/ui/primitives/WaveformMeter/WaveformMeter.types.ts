export interface WaveformMeterProps {
    /**
     * Whether the bars animate; when `false` they collapse to dim 3px stubs.
     * @default true
     */
    active?: boolean;
    /**
     * Number of bars to render; every bar gets its own staggered animation delay.
     * @default 12
     */
    barCount?: number;
    /**
     * Flips the meter horizontally, for the right-hand side of a symmetric layout.
     * @default false
     */
    mirrored?: boolean;
    /** Extra classes for the root `<div>` element. */
    className?: string;
}
