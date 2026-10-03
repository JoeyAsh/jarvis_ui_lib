/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { StarField } from '../StarField';

describe('StarField', () => {
    it('renders with lib-starfield class', () => {
        const { container } = render(<StarField />);
        expect(container.querySelector('.lib-starfield')).toBeDefined();
    });

    it('renders default 60 stars', () => {
        const { container } = render(<StarField />);
        const stars = container.querySelectorAll('.lib-starfield__star');
        expect(stars).toHaveLength(60);
    });

    it('respects custom count prop', () => {
        const { container } = render(<StarField count={10} />);
        const stars = container.querySelectorAll('.lib-starfield__star');
        expect(stars).toHaveLength(10);
    });

    it('merges className', () => {
        const { container } = render(<StarField className="extra" />);
        expect(container.querySelector('.lib-starfield')?.classList.contains('extra')).toBe(true);
    });

    it('injects position and phase as CSS variables, not raw left/top', () => {
        const { container } = render(<StarField count={3} />);
        const stars = container.querySelectorAll<HTMLElement>('.lib-starfield__star');
        stars.forEach((star: HTMLElement) => {
            expect(star.style.getPropertyValue('--star-x')).toMatch(/%$/);
            expect(star.style.getPropertyValue('--star-y')).toMatch(/%$/);
            expect(star.style.getPropertyValue('--star-delay')).toMatch(/^-[\d.]+s$/);
            expect(star.style.left).toBe('');
            expect(star.style.top).toBe('');
            expect(star.style.animationDelay).toBe('');
        });
    });

    it('positions are deterministic for the same count', () => {
        const first = render(<StarField count={5} />).container.innerHTML;
        const second = render(<StarField count={5} />).container.innerHTML;
        expect(first).toBe(second);
    });

    it('has aria-hidden for decorative use', () => {
        const { container } = render(<StarField />);
        expect(container.querySelector('.lib-starfield')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(
            join(process.cwd(), 'src/ui/primitives/StarField/StarField.css'),
            'utf8',
        );
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-starfield__star');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
