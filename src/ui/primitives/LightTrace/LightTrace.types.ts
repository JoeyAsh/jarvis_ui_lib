export interface LightTraceProps {
    /** Additional class names for the absolutely positioned trace `<span>`. */
    className?: string;
    /** CSS color for the tails of the moving light strips (sets `--lt-color`); the bright center stays `--accent-bright`. @default 'var(--accent)' */
    color?: string;
}
