/** Width reserved for y-axis labels. */
export const AXIS_LEFT = 44;

/** Height reserved for x-axis labels. */
export const AXIS_BOTTOM = 22;

/** Space above the plot so the top tick label is not clipped. */
export const PLOT_TOP = 8;

/** Space right of the plot. */
export const PLOT_RIGHT = 8;

/** Width used before the container has been measured (and in environments without ResizeObserver). */
export const FALLBACK_WIDTH = 600;

/** Default plot height. */
export const DEFAULT_CHART_HEIGHT = 200;

/** Maximum number of x labels drawn before labels are thinned out. */
export const MAX_X_LABELS = 12;

/** Tailwind classes per chart color (stroke, fill, swatch background, text). Token based. */
export const CHART_COLOR_CLASSES = {
    accent: { stroke: 'stroke-accent', fill: 'fill-accent', bg: 'bg-accent', text: 'text-accent' },
    bright: {
        stroke: 'stroke-accent-bright',
        fill: 'fill-accent-bright',
        bg: 'bg-accent-bright',
        text: 'text-accent-bright',
    },
    success: {
        stroke: 'stroke-success',
        fill: 'fill-success',
        bg: 'bg-success',
        text: 'text-success',
    },
    warning: {
        stroke: 'stroke-warning',
        fill: 'fill-warning',
        bg: 'bg-warning',
        text: 'text-warning',
    },
    error: { stroke: 'stroke-error', fill: 'fill-error', bg: 'bg-error', text: 'text-error' },
    muted: {
        stroke: 'stroke-text-secondary',
        fill: 'fill-text-secondary',
        bg: 'bg-text-secondary',
        text: 'text-text-secondary',
    },
} as const;
