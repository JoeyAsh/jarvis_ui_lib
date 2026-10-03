export interface StarFieldProps {
    /** Number of stars; positions are deterministic, so the same count always gives the same sky. @default 60 */
    count?: number;
    /** Additional class names for the absolutely positioned star layer `<div>`. */
    className?: string;
}

export interface StarData {
    /** Stable index of the star, used as React key. */
    id: number;
    /** Horizontal position as a CSS percentage. */
    left: string;
    /** Vertical position as a CSS percentage. */
    top: string;
    /** Negative animation delay that offsets the star's twinkle phase. */
    delay: string;
}
