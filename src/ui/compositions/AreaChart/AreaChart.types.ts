import type { BaseChartProps } from '../ChartFrame';
import type { ChartCurve } from '../LineChart';

export interface AreaChartProps extends BaseChartProps {
    /** `smooth` draws curved edges. @default 'linear' */
    curve?: ChartCurve;
    /** Stacks the series on top of each other instead of overlapping them. @default false */
    stacked?: boolean;
}
