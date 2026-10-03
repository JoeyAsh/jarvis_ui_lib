import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { WaveformMeter } from '../WaveformMeter';
import { meterBarDelay } from '../utils';

describe('WaveformMeter', () => {
    it('renders without crashing', () => {
        const { container } = render(<WaveformMeter />);
        expect(container.querySelector('.lib-meter')).toBeDefined();
    });

    it('renders 12 bars by default', () => {
        const { container } = render(<WaveformMeter />);
        expect(container.querySelectorAll('.lib-meter__bar')).toHaveLength(12);
    });

    it('renders custom barCount', () => {
        const { container } = render(<WaveformMeter barCount={6} />);
        expect(container.querySelectorAll('.lib-meter__bar')).toHaveLength(6);
    });

    it('keeps the original stagger for the first 12 bars', () => {
        const { container } = render(<WaveformMeter />);
        const delays = Array.from(container.querySelectorAll<HTMLElement>('.lib-meter__bar')).map(
            (bar) => bar.style.getPropertyValue('--lib-meter-delay'),
        );
        expect(delays).toEqual([
            '-0.6s',
            '-0.5s',
            '-0.4s',
            '-0.3s',
            '-0.2s',
            '-0.1s',
            '0s',
            '-0.15s',
            '-0.25s',
            '-0.35s',
            '-0.45s',
            '-0.55s',
        ]);
    });

    it('gives bars beyond 12 their own delays', () => {
        const { container } = render(<WaveformMeter barCount={24} />);
        const delays = Array.from(container.querySelectorAll<HTMLElement>('.lib-meter__bar')).map(
            (bar) => bar.style.getPropertyValue('--lib-meter-delay'),
        );
        expect(delays).toHaveLength(24);
        expect(new Set(delays.slice(11)).size).toBe(13);
        expect(delays[12]).toBe('-0.65s');
    });

    it('meterBarDelay never returns a positive delay', () => {
        for (let i = 0; i < 64; i++) {
            expect(meterBarDelay(i)).toBeLessThanOrEqual(0);
        }
    });

    it('does not add inactive class when active=true', () => {
        const { container } = render(<WaveformMeter active />);
        expect(container.querySelector('.lib-meter')?.classList.contains('inactive')).toBe(false);
    });

    it('adds inactive class when active=false', () => {
        const { container } = render(<WaveformMeter active={false} />);
        expect(container.querySelector('.lib-meter')?.classList.contains('inactive')).toBe(true);
    });

    it('adds mirrored class when mirrored=true', () => {
        const { container } = render(<WaveformMeter mirrored />);
        expect(container.querySelector('.lib-meter')?.classList.contains('mirrored')).toBe(true);
    });

    it('does not add mirrored class by default', () => {
        const { container } = render(<WaveformMeter />);
        expect(container.querySelector('.lib-meter')?.classList.contains('mirrored')).toBe(false);
    });

    it('is aria-hidden', () => {
        const { container } = render(<WaveformMeter />);
        expect(container.querySelector('.lib-meter')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('merges className', () => {
        const { container } = render(<WaveformMeter className="extra" />);
        expect(container.querySelector('.lib-meter')?.classList.contains('extra')).toBe(true);
    });
});
