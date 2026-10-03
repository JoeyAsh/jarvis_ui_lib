import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BarChart } from '../BarChart';
import type { ChartSeries } from '../../ChartFrame';

const SERIES: ChartSeries[] = [
    { id: 'in', label: 'Inbound', data: [10, 20, 30] },
    { id: 'out', label: 'Outbound', data: [5, 10, 15] },
];

function rects(container: HTMLElement): SVGRectElement[] {
    return Array.from(container.querySelectorAll('svg rect'));
}

describe('BarChart', () => {
    it('draws one bar per value', () => {
        const { container } = render(<BarChart aria-label="Traffic" series={SERIES} />);
        expect(rects(container)).toHaveLength(6);
    });

    it('grouped bars sit side by side, stacked bars share an x', () => {
        const { container, rerender } = render(<BarChart aria-label="Traffic" series={SERIES} />);
        const [a, , , b] = rects(container);
        expect(a?.getAttribute('x')).not.toBe(b?.getAttribute('x'));
        rerender(<BarChart aria-label="Traffic" series={SERIES} stacked />);
        const [sa, , , sb] = rects(container);
        expect(sa?.getAttribute('x')).toBe(sb?.getAttribute('x'));
    });

    it('stacked bars start where the previous series ends', () => {
        const { container } = render(<BarChart aria-label="Traffic" series={SERIES} stacked />);
        const [first, , , second] = rects(container);
        const firstTop = Number(first?.getAttribute('y'));
        const secondBottom =
            Number(second?.getAttribute('y')) + Number(second?.getAttribute('height'));
        expect(secondBottom).toBeCloseTo(firstTop, 5);
    });

    it('bar heights are proportional to the values', () => {
        const { container } = render(
            <BarChart aria-label="Traffic" series={SERIES.slice(0, 1)} yMin={0} yMax={40} />,
        );
        const [ten, twenty] = rects(container);
        expect(Number(twenty?.getAttribute('height'))).toBeCloseTo(
            Number(ten?.getAttribute('height')) * 2,
            5,
        );
    });

    it('negative values grow downward from zero', () => {
        const { container } = render(
            <BarChart aria-label="Delta" series={[{ id: 'd', label: 'Delta', data: [5, -5] }]} />,
        );
        const [up, down] = rects(container);
        expect(Number(down?.getAttribute('y'))).toBeGreaterThanOrEqual(
            Number(up?.getAttribute('y')) + Number(up?.getAttribute('height')) - 0.001,
        );
    });
});
