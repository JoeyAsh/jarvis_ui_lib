import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { CHART_COLOR_CLASSES, ChartFrame, linePath, seriesColor, valueExtent } from '../ChartFrame';
import type { LineChartProps } from './LineChart.types';

/** Line chart for trends over an ordered axis (time, steps). */
export function LineChart({
    curve = 'linear',
    showDots = false,
    ...props
}: LineChartProps): ReactElement {
    return (
        <ChartFrame
            {...props}
            xMode="point"
            domain={valueExtent(props.series, false)}
            renderMarks={(layout) =>
                props.series.map((s, si) => {
                    const color = CHART_COLOR_CLASSES[seriesColor(s, si)];
                    const points = s.data.map((v, i): [number, number] => [
                        layout.xAt(i),
                        layout.y(v),
                    ]);
                    return (
                        <g key={s.id}>
                            <path
                                d={linePath(points, curve === 'smooth')}
                                className={cx('fill-none', color.stroke)}
                                strokeWidth={1.5}
                                strokeLinejoin="round"
                            />
                            {points.map(([x, y], i) =>
                                showDots || i === layout.activeIndex ? (
                                    <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r={i === layout.activeIndex ? 3.5 : 2}
                                        className={cx('stroke-bg', color.fill)}
                                        strokeWidth={1}
                                    />
                                ) : null,
                            )}
                        </g>
                    );
                })
            }
        />
    );
}

export default LineChart;
