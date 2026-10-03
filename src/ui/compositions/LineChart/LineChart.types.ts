import type { BaseChartProps } from '../ChartFrame';

export type ChartCurve = 'linear' | 'smooth';

export interface LineChartProps extends BaseChartProps {
    /** `smooth` draws curved lines through the points. @default 'linear' */
    curve?: ChartCurve;
    /** Draws a dot at every data point (the hovered position always shows dots). @default false */
    showDots?: boolean;
}
