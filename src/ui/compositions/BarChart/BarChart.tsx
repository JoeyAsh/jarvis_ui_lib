import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import {
    CHART_COLOR_CLASSES,
    ChartFrame,
    pointCount,
    seriesColor,
    stackBases,
    stackTotals,
    valueExtent,
} from '../ChartFrame';
import { BAR_FILL_RATIO, BAR_GROUP_GAP } from './constants';
import type { BarChartProps } from './BarChart.types';

/** Bar chart for comparing values across categories; grouped or stacked. */
export function BarChart({ stacked = false, ...props }: BarChartProps): ReactElement {
    const count = pointCount(props.series, props.labels);
    const bases = stacked ? stackBases(props.series, count) : null;
    const totals = stackTotals(props.series, count);
    const domain: [number, number] = stacked
        ? [Math.min(0, ...totals), Math.max(0, ...totals)]
        : valueExtent(props.series, true);
    const groups = Math.max(1, props.series.length);

    return (
        <ChartFrame
            {...props}
            xMode="band"
            domain={domain}
            renderMarks={(layout) => {
                const inner = layout.band * BAR_FILL_RATIO;
                const barWidth = stacked
                    ? inner
                    : Math.max(1, (inner - BAR_GROUP_GAP * (groups - 1)) / groups);
                return props.series.map((s, si) => {
                    const color = CHART_COLOR_CLASSES[seriesColor(s, si)];
                    return (
                        <g key={s.id} className={color.fill}>
                            {s.data.map((v, i) => {
                                const base = bases?.[si]?.[i] ?? 0;
                                const y0 = layout.y(base);
                                const y1 = layout.y(base + v);
                                const left = layout.xAt(i) - inner / 2;
                                const x = stacked ? left : left + si * (barWidth + BAR_GROUP_GAP);
                                return (
                                    <rect
                                        key={i}
                                        x={x}
                                        y={Math.min(y0, y1)}
                                        width={barWidth}
                                        height={Math.max(0, Math.abs(y1 - y0))}
                                        fillOpacity={
                                            layout.activeIndex === null || layout.activeIndex === i
                                                ? 0.85
                                                : 0.35
                                        }
                                        className={cx('transition-[fill-opacity] duration-[150ms]')}
                                    />
                                );
                            })}
                        </g>
                    );
                });
            }}
        />
    );
}

export default BarChart;
