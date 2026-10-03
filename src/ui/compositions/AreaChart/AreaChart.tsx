import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import {
    CHART_COLOR_CLASSES,
    ChartFrame,
    linePath,
    pointCount,
    seriesColor,
    stackBases,
    stackTotals,
    valueExtent,
} from '../ChartFrame';
import type { AreaChartProps } from './AreaChart.types';

/** Area chart for volumes over an ordered axis; optionally stacked to show a total. */
export function AreaChart({
    curve = 'linear',
    stacked = false,
    ...props
}: AreaChartProps): ReactElement {
    const count = pointCount(props.series, props.labels);
    const bases = stacked ? stackBases(props.series, count) : null;
    const totals = stackTotals(props.series, count);
    const domain: [number, number] = stacked
        ? [Math.min(0, ...totals), Math.max(0, ...totals)]
        : valueExtent(props.series, true);

    return (
        <ChartFrame
            {...props}
            xMode="point"
            domain={domain}
            renderMarks={(layout) =>
                props.series.map((s, si) => {
                    const color = CHART_COLOR_CLASSES[seriesColor(s, si)];
                    const base = bases?.[si];
                    const top = s.data.map((v, i): [number, number] => [
                        layout.xAt(i),
                        layout.y(v + (base?.[i] ?? 0)),
                    ]);
                    const bottom = s.data
                        .map((_, i): [number, number] => [layout.xAt(i), layout.y(base?.[i] ?? 0)])
                        .reverse();
                    const smooth = curve === 'smooth';
                    const edge = linePath(top, smooth);
                    const lower = linePath(bottom, smooth).replace(/^M/, 'L');
                    return (
                        <g key={s.id}>
                            <path
                                d={`${edge} ${lower} Z`}
                                className={color.fill}
                                fillOpacity={0.14}
                            />
                            <path
                                d={edge}
                                className={cx('fill-none', color.stroke)}
                                strokeWidth={1.5}
                                strokeLinejoin="round"
                            />
                            {layout.activeIndex !== null && top[layout.activeIndex] && (
                                <circle
                                    cx={top[layout.activeIndex]?.[0]}
                                    cy={top[layout.activeIndex]?.[1]}
                                    r={3.5}
                                    className={cx('stroke-bg', color.fill)}
                                />
                            )}
                        </g>
                    );
                })
            }
        />
    );
}

export default AreaChart;
