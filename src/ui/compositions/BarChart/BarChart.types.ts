import type { BaseChartProps } from '../ChartFrame';

export interface BarChartProps extends BaseChartProps {
    /** Stacks the series into one bar per position instead of grouping them side by side. @default false */
    stacked?: boolean;
}
