/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { GridBackground } from '../GridBackground';

describe('GridBackground', () => {
    it('renders a div with aria-hidden', () => {
        const { container } = render(<GridBackground />);
        const el = container.querySelector('[aria-hidden]');
        expect(el).toBeDefined();
    });

    it('has fixed inset-0 positioning on z-0', () => {
        const { container } = render(<GridBackground />);
        const el = container.querySelector('div');
        expect(el?.className).toContain('fixed');
        expect(el?.className).toContain('inset-0');
        expect(el?.classList.contains('z-0')).toBe(true);
    });

    it('pointer-events-none is set', () => {
        const { container } = render(<GridBackground />);
        expect(container.querySelector('div')?.className).toContain('pointer-events-none');
    });

    it('className merges', () => {
        const { container } = render(<GridBackground className="my-grid" />);
        expect(container.querySelector('div')?.className).toContain('my-grid');
    });

    it('injects grid size and drift duration as CSS variables only', () => {
        const { container } = render(<GridBackground gridSize={30} />);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.style.getPropertyValue('--jlib-grid-size')).toBe('30px');
        expect(el.style.getPropertyValue('--jlib-grid-duration')).toBe('3s');
        expect(el.style.backgroundImage).toBe('');
        expect(el.style.animation).toBe('');
    });

    it('drift prop adds the drift class', () => {
        const { container } = render(<GridBackground drift />);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.classList.contains('lib-grid-bg--drift')).toBe(true);
    });

    it('no drift class without drift', () => {
        const { container } = render(<GridBackground />);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.classList.contains('lib-grid-bg')).toBe(true);
        expect(el.classList.contains('lib-grid-bg--drift')).toBe(false);
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(
            join(process.cwd(), 'src/ui/primitives/GridBackground/GridBackground.css'),
            'utf8',
        );
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-grid-bg--drift');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
