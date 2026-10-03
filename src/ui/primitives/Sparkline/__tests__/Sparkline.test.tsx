import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from '../Sparkline';

const DATA = [5, 8, 3, 9, 6, 10, 4];

describe('Sparkline', () => {
    it('renders an svg element', () => {
        const { container } = render(<Sparkline data={DATA} />);
        expect(container.querySelector('svg')).toBeDefined();
    });

    it('renders path elements when data has 2+ points', () => {
        const { container } = render(<Sparkline data={DATA} />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
    });

    it('accent variant uses accent token classes', () => {
        const { container } = render(<Sparkline data={DATA} variant="accent" />);
        const [fill, line] = Array.from(container.querySelectorAll('path'));
        expect(fill?.getAttribute('class')).toContain('fill-accent-bright');
        expect(line?.getAttribute('class')).toContain('stroke-accent-bright');
        expect(line?.getAttribute('fill')).toBe('none');
    });

    it('warn variant uses warning token classes', () => {
        const { container } = render(<Sparkline data={DATA} variant="warn" />);
        const [fill, line] = Array.from(container.querySelectorAll('path'));
        expect(fill?.getAttribute('class')).toContain('fill-warning');
        expect(line?.getAttribute('class')).toContain('stroke-warning');
    });

    it('uses no hardcoded color attributes', () => {
        const { container } = render(<Sparkline data={DATA} />);
        for (const path of Array.from(container.querySelectorAll('path'))) {
            expect(path.getAttribute('stroke')).toBeNull();
            expect(path.getAttribute('fill') ?? 'none').toBe('none');
        }
    });

    it('injects the height as a CSS variable', () => {
        const { container } = render(<Sparkline data={DATA} height={40} />);
        const svg = container.querySelector('svg');
        expect(svg?.style.getPropertyValue('--sparkline-height')).toBe('40px');
        expect(svg?.getAttribute('class')).toContain('h-[var(--sparkline-height)]');
        expect(svg?.style.height).toBe('');
    });

    it('aria-label is set when provided', () => {
        const { container } = render(<Sparkline data={DATA} aria-label="CPU chart" />);
        expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('CPU chart');
    });

    it('renders nothing when data has fewer than 2 points', () => {
        const { container } = render(<Sparkline data={[5]} />);
        const paths = container.querySelectorAll('path');
        expect(paths.length).toBe(0);
    });

    it('className merges onto svg', () => {
        const { container } = render(<Sparkline data={DATA} className="my-sparkline" />);
        expect(container.querySelector('svg')?.getAttribute('class')).toContain('my-sparkline');
    });
});
