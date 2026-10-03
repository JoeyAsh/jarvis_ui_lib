// Internal chart scaffold shared by LineChart, AreaChart and BarChart. Not exported from the barrel.
export { ChartFrame } from './ChartFrame';
export type {
    BaseChartProps,
    ChartColor,
    ChartFrameProps,
    ChartLayout,
    ChartSeries,
} from './ChartFrame.types';
export { CHART_COLOR_CLASSES } from './constants';
export { linePath, pointCount, seriesColor, stackBases, stackTotals, valueExtent } from './scale';
export { default } from './ChartFrame';
