export interface WaveformMeterProps {
    /**
     * Whether the bars animate; when `false` they collapse to dim 3px stubs.
     * @default true
     */
    active?: boolean;
    /**
     * Number of bars to render; the first 12 bars have staggered animation delays.
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
