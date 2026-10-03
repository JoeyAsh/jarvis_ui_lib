import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { LineChart } from '../LineChart';
import type { ChartSeries } from '../../ChartFrame';

const SERIES: ChartSeries[] = [
    { id: 'cpu', label: 'CPU', data: [20, 45, 30] },
    { id: 'mem', label: 'Memory', data: [50, 55, 60], color: 'warning' },
];
const LABELS = ['Mon', 'Tue', 'Wed'];

describe('LineChart', () => {
    it('renders one line per series', () => {
        const { container } = render(
            <LineChart aria-label="Load" series={SERIES} labels={LABELS} />,
        );
        const paths = container.querySelectorAll('svg path');
        expect(paths).toHaveLength(2);
        expect(paths[1]?.getAttribute('class')).toContain('stroke-warning');
    });

    it('exposes the data as a screen-reader table', () => {
        render(<LineChart aria-label="Load" series={SERIES} labels={LABELS} />);
        const table = screen.getByRole('table', { name: 'Load' });
        expect(
            within(table)
                .getAllByRole('columnheader')
                .map((c) => c.textContent),
        ).toEqual(['Label', 'CPU', 'Memory']);
        expect(within(table).getByRole('rowheader', { name: 'Tue' })).toBeDefined();
        expect(within(table).getByText('45')).toBeDefined();
    });

    it('shows a legend for multiple series and hides it for one', () => {
        const { rerender, container } = render(
            <LineChart aria-label="Load" series={SERIES} labels={LABELS} />,
        );
        expect(container.querySelector('figcaption')?.textContent).toContain('Memory');
        rerender(<LineChart aria-label="Load" series={SERIES.slice(0, 1)} labels={LABELS} />);
        expect(container.querySelector('figcaption')).toBeNull();
    });

    it('keyboard inspection: the range input selects a position and describes its values', () => {
        render(<LineChart aria-label="Load" series={SERIES} labels={LABELS} />);
        const slider = screen.getByRole('slider', { name: 'Inspect Load' });
        fireEvent.focus(slider);
        fireEvent.change(slider, { target: { value: '1' } });
        expect(slider.getAttribute('aria-valuetext')).toBe('Tue: CPU 45, Memory 55');
    });

    it('draws dots when showDots is set', () => {
        const { container } = render(
            <LineChart aria-label="Load" series={SERIES} labels={LABELS} showDots />,
        );
        expect(container.querySelectorAll('circle')).toHaveLength(6);
    });

    it('uses formatValue for axis and table', () => {
        render(
            <LineChart
                aria-label="Load"
                series={SERIES}
                labels={LABELS}
                formatValue={(v) => `${v}%`}
            />,
        );
        expect(screen.getAllByText('45%').length).toBeGreaterThan(0);
    });

    it('showTooltip={false} removes the inspection control', () => {
        render(<LineChart aria-label="Load" series={SERIES} showTooltip={false} />);
        expect(screen.queryByRole('slider')).toBeNull();
    });

    it('merges className onto the figure', () => {
        const { container } = render(
            <LineChart aria-label="Load" series={SERIES} className="extra" />,
        );
        expect(container.querySelector('figure')?.className).toContain('extra');
    });
});
