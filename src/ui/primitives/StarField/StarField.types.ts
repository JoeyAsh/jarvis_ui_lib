export interface StarFieldProps {
    /**
     * Number of stars; positions are deterministic, so the same count always gives the same sky.
     * The twinkle stops under `prefers-reduced-motion: reduce`.
     * @default 60
     */
    count?: number;
    /** Additional class names for the absolutely positioned star layer `<div>`. */
    className?: string;
}

export interface StarData {
    /** Stable index of the star, used as React key. */
    id: number;
    /** Horizontal position as a CSS percentage (injected as `--star-x`). */
    left: string;
    /** Vertical position as a CSS percentage (injected as `--star-y`). */
    top: string;
    /** Negative animation delay that offsets the star's twinkle phase (injected as `--star-delay`). */
    delay: string;
}
