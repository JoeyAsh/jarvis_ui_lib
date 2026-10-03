export interface GridBackgroundProps {
    /** Slowly scrolls the grid diagonally in a loop. @default false */
    drift?: boolean;
    /** Size of one grid cell in pixels. @default 44 */
    gridSize?: number;
    /** Additional class names for the fixed, full-viewport layer `<div>`, e.g. a z-index utility. */
    className?: string;
}
