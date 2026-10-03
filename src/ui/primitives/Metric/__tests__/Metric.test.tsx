import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Metric } from '../Metric';

describe('Metric', () => {
    it('renders value', () => {
        render(<Metric value={42} />);
        expect(screen.getByText('42')).toBeDefined();
    });

    it('renders unit as small element', () => {
        const { container } = render(<Metric value={42} unit="%" />);
        expect(container.querySelector('small')?.textContent).toBe('%');
    });

    it('default has text-accent-bright class', () => {
        const { container } = render(<Metric value={1} />);
        expect(container.querySelector('span')?.className).toContain('text-accent-bright');
    });

    it('warn prop gives text-warning class', () => {
        const { container } = render(<Metric value={87} unit="°C" warn />);
        expect(container.querySelector('span')?.className).toContain('text-warning');
    });

    it('small prop changes size class', () => {
        const { container } = render(<Metric value={1} small />);
        expect(container.querySelector('span')?.className).toContain('text-[12px]');
    });

    it('className merges', () => {
        const { container } = render(<Metric value={1} className="custom-metric" />);
        expect(container.querySelector('span')?.className).toContain('custom-metric');
    });

    it('forwards native attributes to the span', () => {
        const { container } = render(
            <Metric
                value={42}
                unit="%"
                id="cpu"
                title="CPU load"
                aria-label="CPU 42 percent"
                data-k="1"
            />,
        );
        const el = container.querySelector('span');
        expect(el?.id).toBe('cpu');
        expect(el?.getAttribute('title')).toBe('CPU load');
        expect(el?.getAttribute('aria-label')).toBe('CPU 42 percent');
        expect(el?.getAttribute('data-k')).toBe('1');
    });
});
