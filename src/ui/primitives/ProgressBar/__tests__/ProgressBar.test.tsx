import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
    it('renders a progressbar role', () => {
        const { container } = render(<ProgressBar value={0.5} aria-label="Progress" />);
        expect(container.querySelector('[role="progressbar"]')).toBeDefined();
    });

    it('aria-valuenow reflects value * 100', () => {
        const { container } = render(<ProgressBar value={0.42} aria-label="P" />);
        const el = container.querySelector('[role="progressbar"]');
        expect(el?.getAttribute('aria-valuenow')).toBe('42');
    });

    it('default variant fill has bg-accent class', () => {
        const { container } = render(<ProgressBar value={0.5} />);
        const fill = container.querySelector('[role="progressbar"] > div');
        expect(fill?.className).toContain('bg-accent');
    });

    it('variant bright has bg-accent-bright class', () => {
        const { container } = render(<ProgressBar value={0.5} variant="bright" />);
        const fill = container.querySelector('[role="progressbar"] > div');
        expect(fill?.className).toContain('bg-accent-bright');
    });

    it('variant warn has bg-warning class', () => {
        const { container } = render(<ProgressBar value={0.5} variant="warn" />);
        const fill = container.querySelector('[role="progressbar"] > div');
        expect(fill?.className).toContain('bg-warning');
    });

    it('injects the fill width as the --progress variable', () => {
        render(<ProgressBar value={0.75} aria-label="P" />);
        const bar = screen.getByRole('progressbar');
        expect(bar.style.getPropertyValue('--progress')).toBe('75.0%');
    });

    it('fill uses the --progress variable instead of an inline width', () => {
        render(<ProgressBar value={0.75} aria-label="P" />);
        const fill = screen.getByRole('progressbar').firstElementChild;
        expect(fill?.className).toContain('w-[var(--progress)]');
        expect(fill?.getAttribute('style')).toBeNull();
    });

    it('value clamps to 0–1', () => {
        render(<ProgressBar value={2} aria-label="P" />);
        const bar = screen.getByRole('progressbar');
        expect(bar.style.getPropertyValue('--progress')).toBe('100.0%');
        expect(bar.getAttribute('aria-valuenow')).toBe('100');
    });

    it('height normal gives h-[4px]', () => {
        const { container } = render(<ProgressBar value={0.5} height="normal" />);
        const el = container.querySelector('[role="progressbar"]');
        expect(el?.className).toContain('h-[4px]');
    });

    it('className merges on root', () => {
        const { container } = render(<ProgressBar value={0.5} className="my-bar" />);
        expect(container.querySelector('[role="progressbar"]')?.className).toContain('my-bar');
    });
});
