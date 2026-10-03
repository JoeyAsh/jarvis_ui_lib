import { describe, it, expect } from 'vitest';
import {
    linePath,
    niceTicks,
    pointCount,
    seriesColor,
    stackBases,
    stackTotals,
    valueExtent,
} from '../scale';
import type { ChartSeries } from '../ChartFrame.types';

const SERIES: ChartSeries[] = [
    { id: 'a', label: 'A', data: [1, 4, 2] },
    { id: 'b', label: 'B', data: [3, -1, 5], color: 'error' },
];

describe('chart scale helpers', () => {
    it('niceTicks covers the range with round steps', () => {
        expect(niceTicks(0, 97, 4)).toEqual([0, 25, 50, 75, 100]);
        expect(niceTicks(-3, 7, 5)).toEqual([-4, -2, 0, 2, 4, 6, 8]);
    });

    it('niceTicks pads a flat range', () => {
        const ticks = niceTicks(5, 5, 4);
        expect(ticks[0]).toBeLessThan(5);
        expect(ticks[ticks.length - 1]).toBeGreaterThan(5);
    });

    it('valueExtent optionally includes zero', () => {
        expect(valueExtent([{ id: 'x', label: 'X', data: [3, 8] }], false)).toEqual([3, 8]);
        expect(valueExtent([{ id: 'x', label: 'X', data: [3, 8] }], true)).toEqual([0, 8]);
        expect(valueExtent([], true)).toEqual([0, 1]);
    });

    it('stackTotals and stackBases sum series per position', () => {
        expect(stackTotals(SERIES, 3)).toEqual([4, 3, 7]);
        expect(stackBases(SERIES, 3)).toEqual([
            [0, 0, 0],
            [1, 4, 2],
        ]);
    });

    it('pointCount uses the longest series or label list', () => {
        expect(pointCount(SERIES, undefined)).toBe(3);
        expect(pointCount(SERIES, ['a', 'b', 'c', 'd'])).toBe(4);
    });

    it('seriesColor prefers the own color, else picks by index', () => {
        expect(seriesColor(SERIES[1] ?? SERIES[0], 1)).toBe('error');
        expect(seriesColor({ id: 'c', label: 'C', data: [] }, 0)).toBe('accent');
    });

    it('linePath draws straight or smooth paths', () => {
        const pts: [number, number][] = [
            [0, 0],
            [10, 10],
            [20, 0],
        ];
        expect(linePath(pts, false)).toBe('M0,0 L10,10 L20,0');
        expect(linePath(pts, true)).toMatch(/^M0,0 C/);
        expect(linePath([], false)).toBe('');
    });
});
