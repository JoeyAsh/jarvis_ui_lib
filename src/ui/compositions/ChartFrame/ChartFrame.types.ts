import type { ReactNode } from 'react';

/** Token color of a chart series. */
export type ChartColor = 'accent' | 'bright' | 'success' | 'warning' | 'error' | 'muted';

/** One data series of a `LineChart`, `AreaChart` or `BarChart`. */
export interface ChartSeries {
    /** Unique id of the series. */
    id: string;
    /** Name shown in the legend, tooltip and screen-reader table. */
    label: string;
    /** One value per x position (same length as `labels`). */
    data: number[];
    /** Token color; defaults to a color by series position. */
    color?: ChartColor;
}

/** Props shared by `LineChart`, `AreaChart` and `BarChart`. */
export interface BaseChartProps {
    /** Data series to draw. */
    series: ChartSeries[];
    /** X-axis labels, one per data point. Defaults to `1, 2, 3, …`. */
    labels?: string[];
    /** Accessible name of the chart; also the caption of the screen-reader data table. */
    'aria-label': string;
    /** Height of the plot in pixels (axes and legend add to it). @default 200 */
    height?: number;
    /** Lower bound of the y-axis; computed from the data when omitted. */
    yMin?: number;
    /** Upper bound of the y-axis; computed from the data when omitted. */
    yMax?: number;
    /** Approximate number of y-axis ticks. @default 4 */
    yTicks?: number;
    /** Formats values on the y-axis and in the tooltip. */
    formatValue?: (value: number) => string;
    /** Draws horizontal grid lines at the y ticks. @default true */
    showGrid?: boolean;
    /** Shows the legend; defaults to `true` for more than one series. */
    showLegend?: boolean;
    /** Shows the hover/keyboard tooltip with the values at a position. @default true */
    showTooltip?: boolean;
    /** Additional class names for the root element. */
    className?: string;
}

/** Geometry handed to a chart's mark renderer. */
export interface ChartLayout {
    /** Plot width in pixels. */
    width: number;
    /** Plot height in pixels. */
    height: number;
    /** Number of x positions. */
    count: number;
    /** X coordinate of the center of position `i`. */
    xAt: (i: number) => number;
    /** Width of one x band (bar charts use it). */
    band: number;
    /** Y coordinate of a value. */
    y: (value: number) => number;
    /** Currently highlighted x position, or null. */
    activeIndex: number | null;
}

export interface ChartFrameProps extends BaseChartProps {
    /** `band` centers points in equal columns (bars); `point` spreads them edge to edge (lines). */
    xMode: 'band' | 'point';
    /** Value domain of the marks, e.g. including stacked totals. */
    domain: [number, number];
    /** Draws the series marks inside the plot area. */
    renderMarks: (layout: ChartLayout) => ReactNode;
}
