export interface LightTraceProps {
    /** Additional class names for the absolutely positioned trace `<span>`. */
    className?: string;
    /**
     * CSS color of the moving light strips (sets `--lt-color`). It tints the tails, and the bright
     * center and glow become a lightened mix of the same color. Without it the tails use `--accent`
     * and the center `--accent-bright`. @default 'var(--accent)'
     */
    color?: string;
}
