export type SparklineVariant = 'accent' | 'warn';

export interface SparklineProps {
    /** Series of values, oldest first; scaled to fit between its own minimum and maximum. Needs at least two points to draw. */
    data: number[];
    /** Line and fill color: the accent or the warning color. @default 'accent' */
    variant?: SparklineVariant;
    /** Width of the SVG coordinate system; the line always stretches to the container width. @default 100 */
    width?: number;
    /** Height of the chart in pixels. @default 28 */
    height?: number;
    /** Additional class names for the root `<svg>` (full width by default). */
    className?: string;
    /** Accessible description of the chart; when set, the SVG gets `role="img"`. */
    'aria-label'?: string;
}
