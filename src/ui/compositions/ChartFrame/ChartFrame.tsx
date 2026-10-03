import { useId, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useElementWidth } from './useElementWidth';
import { defaultFormat, niceTicks, pointCount, seriesColor } from './scale';
import {
    AXIS_BOTTOM,
    AXIS_LEFT,
    CHART_COLOR_CLASSES,
    DEFAULT_CHART_HEIGHT,
    MAX_X_LABELS,
    PLOT_RIGHT,
    PLOT_TOP,
} from './constants';
import type { ChartFrameProps, ChartLayout } from './ChartFrame.types';

/**
 * Shared chart scaffold (internal): measures the width, draws grid, axes and legend, handles the
 * hover/keyboard inspection with tooltip, and renders a screen-reader data table. Each chart only
 * draws its marks through `renderMarks`.
 */
export function ChartFrame({
    series,
    labels,
    'aria-label': ariaLabel,
    height = DEFAULT_CHART_HEIGHT,
    yMin,
    yMax,
    yTicks = 4,
    formatValue = defaultFormat,
    showGrid = true,
    showLegend,
    showTooltip = true,
    className,
    xMode,
    domain,
    renderMarks,
}: ChartFrameProps): ReactElement {
    const baseId = useId();
    const [wrapRef, outerWidth] = useElementWidth<HTMLDivElement>();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const count = pointCount(series, labels);
    const ticks = niceTicks(yMin ?? domain[0], yMax ?? domain[1], yTicks);
    const lo = yMin ?? ticks[0] ?? 0;
    const hi = yMax ?? ticks[ticks.length - 1] ?? 1;
    const width = Math.max(1, outerWidth - AXIS_LEFT - PLOT_RIGHT);
    const band = count > 0 ? width / count : width;

    const layout: ChartLayout = {
        width,
        height,
        count,
        band,
        xAt: (i) =>
            xMode === 'band'
                ? band * i + band / 2
                : count <= 1
                  ? width / 2
                  : (width / (count - 1)) * i,
        y: (v) => height - ((v - lo) / (hi - lo || 1)) * height,
        activeIndex,
    };

    const labelAt = (i: number): string => labels?.[i] ?? String(i + 1);
    const labelStep = Math.max(1, Math.ceil(count / MAX_X_LABELS));
    const legend = showLegend ?? series.length > 1;

    function indexFromPointer(e: MouseEvent<HTMLDivElement>): number {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - AXIS_LEFT;
        const raw =
            xMode === 'band'
                ? Math.floor(x / band)
                : Math.round(x / (width / Math.max(1, count - 1)));
        return Math.min(count - 1, Math.max(0, raw));
    }

    const valueText = (i: number): string =>
        `${labelAt(i)}: ${series.map((s) => `${s.label} ${formatValue(s.data[i] ?? 0)}`).join(', ')}`;

    const tooltipX = activeIndex === null ? 0 : AXIS_LEFT + layout.xAt(activeIndex);
    const flip = tooltipX > outerWidth / 2;

    return (
        <figure className={cx('m-0 flex flex-col gap-2 font-mono', className)}>
            <div
                ref={wrapRef}
                role="presentation"
                className="relative w-full rounded-[2px] focus-within:ring-1 focus-within:ring-accent"
                onMouseMove={(e) => {
                    if (showTooltip && count > 0) setActiveIndex(indexFromPointer(e));
                }}
                onMouseLeave={() => setActiveIndex(null)}
            >
                <svg
                    width={outerWidth}
                    height={height + PLOT_TOP + AXIS_BOTTOM}
                    aria-hidden="true"
                    className="block overflow-visible"
                >
                    <g transform={`translate(${AXIS_LEFT},${PLOT_TOP})`}>
                        {ticks.map((t) => (
                            <g key={t} transform={`translate(0,${layout.y(t)})`}>
                                {showGrid && (
                                    <line
                                        x2={width}
                                        className={cx(
                                            'stroke-border',
                                            t === 0 && lo < 0 && 'stroke-border-bright',
                                        )}
                                        strokeDasharray={t === lo ? undefined : '2 3'}
                                    />
                                )}
                                <text
                                    x={-8}
                                    dy="0.32em"
                                    textAnchor="end"
                                    className="fill-text-muted text-[9px]"
                                >
                                    {formatValue(t)}
                                </text>
                            </g>
                        ))}
                        {renderMarks(layout)}
                        {activeIndex !== null && (
                            <line
                                x1={layout.xAt(activeIndex)}
                                x2={layout.xAt(activeIndex)}
                                y2={height}
                                className="stroke-accent-dim"
                            />
                        )}
                        {Array.from({ length: count }, (_, i) =>
                            i % labelStep === 0 ? (
                                <text
                                    key={i}
                                    x={layout.xAt(i)}
                                    y={height + 15}
                                    textAnchor="middle"
                                    className={cx(
                                        'text-[9px] uppercase',
                                        i === activeIndex
                                            ? 'fill-accent-bright'
                                            : 'fill-text-muted',
                                    )}
                                >
                                    {labelAt(i)}
                                </text>
                            ) : null,
                        )}
                    </g>
                </svg>

                {showTooltip && count > 0 && (
                    <input
                        type="range"
                        min={0}
                        max={count - 1}
                        value={activeIndex ?? 0}
                        aria-label={`Inspect ${ariaLabel}`}
                        aria-valuetext={valueText(activeIndex ?? 0)}
                        className="sr-only"
                        onChange={(e) => setActiveIndex(Number(e.target.value))}
                        onFocus={() => setActiveIndex((i) => i ?? 0)}
                        onBlur={() => setActiveIndex(null)}
                    />
                )}

                {showTooltip && activeIndex !== null && (
                    <div
                        aria-hidden="true"
                        className={cx(
                            'pointer-events-none absolute top-[var(--tip-top)] z-[1] min-w-[120px]',
                            'border border-border-bright rounded-[2px] bg-[rgba(13,13,20,0.94)] px-[10px] py-[6px]',
                            'text-[10px] shadow-glow',
                            flip
                                ? 'right-[calc(100%-var(--tip-x)+12px)]'
                                : 'left-[calc(var(--tip-x)+12px)]',
                        )}
                        style={
                            {
                                '--tip-x': `${tooltipX}px`,
                                '--tip-top': `${PLOT_TOP}px`,
                            } as CSSProperties
                        }
                    >
                        <div className="mb-1 uppercase tracking-[1px] text-text-secondary">
                            {labelAt(activeIndex)}
                        </div>
                        {series.map((s, si) => (
                            <div key={s.id} className="flex items-center gap-2">
                                <span
                                    className={cx(
                                        'inline-block h-[6px] w-[6px]',
                                        CHART_COLOR_CLASSES[seriesColor(s, si)].bg,
                                    )}
                                />
                                <span className="text-text-secondary">{s.label}</span>
                                <span className="ml-auto pl-3 text-text">
                                    {formatValue(s.data[activeIndex] ?? 0)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {legend && (
                <figcaption aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 pl-[44px]">
                    {series.map((s, si) => (
                        <span
                            key={s.id}
                            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[1px] text-text-secondary"
                        >
                            <span
                                className={cx(
                                    'inline-block h-[2px] w-[12px]',
                                    CHART_COLOR_CLASSES[seriesColor(s, si)].bg,
                                )}
                            />
                            {s.label}
                        </span>
                    ))}
                </figcaption>
            )}

            <table className="sr-only" aria-labelledby={`${baseId}-caption`}>
                <caption id={`${baseId}-caption`}>{ariaLabel}</caption>
                <thead>
                    <tr>
                        <th scope="col">Label</th>
                        {series.map((s) => (
                            <th key={s.id} scope="col">
                                {s.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: count }, (_, i) => (
                        <tr key={i}>
                            <th scope="row">{labelAt(i)}</th>
                            {series.map((s) => (
                                <td key={s.id}>{formatValue(s.data[i] ?? 0)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}

export default ChartFrame;
