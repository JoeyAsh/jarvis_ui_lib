import type { ChartColor, ChartSeries } from './ChartFrame.types';

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/** Evenly spaced "nice" tick values that cover `[min, max]` with about `count` steps. */
export function niceTicks(min: number, max: number, count: number): number[] {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return [0];
    if (min === max) {
        const pad = min === 0 ? 1 : Math.abs(min) * 0.1;
        return niceTicks(min - pad, max + pad, count);
    }
    const raw = (max - min) / Math.max(1, count);
    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const step = (NICE_STEPS.find((s) => s * magnitude >= raw) ?? 10) * magnitude;
    const start = Math.floor(min / step) * step;
    const end = Math.ceil(max / step) * step;
    const ticks: number[] = [];
    for (let v = start; v <= end + step / 2; v += step) {
        ticks.push(Number(v.toFixed(10)));
    }
    return ticks;
}

/** Min and max over all series values, optionally forcing 0 into the range. */
export function valueExtent(series: ChartSeries[], includeZero: boolean): [number, number] {
    const values = series.flatMap((s) => s.data).filter((v) => Number.isFinite(v));
    if (values.length === 0) return [0, 1];
    let min = Math.min(...values);
    let max = Math.max(...values);
    if (includeZero) {
        min = Math.min(0, min);
        max = Math.max(0, max);
    }
    return [min, max];
}

/** Per-position sums of all series (for stacked charts). */
export function stackTotals(series: ChartSeries[], count: number): number[] {
    return Array.from({ length: count }, (_, i) =>
        series.reduce((sum, s) => sum + (s.data[i] ?? 0), 0),
    );
}

/** Running stack bases: `bases[s][i]` is the sum of series before `s` at position `i`. */
export function stackBases(series: ChartSeries[], count: number): number[][] {
    const running = new Array<number>(count).fill(0);
    return series.map((s) => {
        const base = [...running];
        for (let i = 0; i < count; i++) running[i] = (running[i] ?? 0) + (s.data[i] ?? 0);
        return base;
    });
}

/** Number of x positions: the longest series or the label count. */
export function pointCount(series: ChartSeries[], labels: string[] | undefined): number {
    return Math.max(labels?.length ?? 0, ...series.map((s) => s.data.length), 0);
}

const SERIES_ORDER: ChartColor[] = ['accent', 'success', 'warning', 'bright', 'error', 'muted'];

/** Color of a series: its own, or one picked by position. */
export function seriesColor(series: ChartSeries, index: number): ChartColor {
    return series.color ?? SERIES_ORDER[index % SERIES_ORDER.length] ?? 'accent';
}

const NUMBER_FORMAT = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });

/** Default value formatter: up to two decimals with thousands separators. */
export function defaultFormat(value: number): string {
    return NUMBER_FORMAT.format(value);
}

/** SVG path through points; `smooth` uses a monotone-ish cardinal curve. */
export function linePath(points: [number, number][], smooth: boolean): string {
    if (points.length === 0) return '';
    const [first, ...rest] = points;
    if (first === undefined) return '';
    if (!smooth || points.length < 3) {
        return `M${first[0]},${first[1]}` + rest.map(([x, y]) => ` L${x},${y}`).join('');
    }
    let d = `M${first[0]},${first[1]}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined) continue;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
}
