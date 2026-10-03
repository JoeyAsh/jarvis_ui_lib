import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AreaChart } from '../AreaChart';
import type { ChartSeries } from '../../ChartFrame';

const SERIES: ChartSeries[] = [
    { id: 'a', label: 'Solar', data: [2, 4, 3] },
    { id: 'b', label: 'Fusion', data: [5, 5, 6] },
];

describe('AreaChart', () => {
    it('draws a filled area and an edge per series', () => {
        const { container } = render(<AreaChart aria-label="Power" series={SERIES} />);
        const paths = container.querySelectorAll('svg path');
        expect(paths).toHaveLength(4);
        expect(paths[0]?.getAttribute('d')).toMatch(/Z$/);
        expect(paths[0]?.getAttribute('fill-opacity')).toBe('0.14');
    });

    it('stacked areas scale the axis to the totals', () => {
        render(<AreaChart aria-label="Power" series={SERIES} stacked yTicks={3} />);
        // totals peak at 9 → nice ticks reach at least 9
        const labels = screen.getAllByText(/^\d+$/).map((el) => Number(el.textContent));
        expect(Math.max(...labels)).toBeGreaterThanOrEqual(9);
    });

    it('smooth curves use bezier segments', () => {
        const { container } = render(
            <AreaChart aria-label="Power" series={SERIES} curve="smooth" />,
        );
        expect(container.querySelector('svg path')?.getAttribute('d')).toContain('C');
    });

    it('exposes the data table', () => {
        render(<AreaChart aria-label="Power" series={SERIES} labels={['Q1', 'Q2', 'Q3']} />);
        expect(screen.getByRole('table', { name: 'Power' }).textContent).toContain('Fusion');
    });
});
