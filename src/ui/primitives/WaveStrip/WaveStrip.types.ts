export interface WaveStripProps {
    /**
     * Whether the seven bars animate; when `false` they collapse to dim 2px stubs.
     * @default true
     */
    active?: boolean;
    /**
     * Flips the strip horizontally, for the trailing side of a label.
     * @default false
     */
    mirrored?: boolean;
    /** Extra classes for the root `<span>` element. */
    className?: string;
}
