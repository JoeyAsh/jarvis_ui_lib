/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { Scene } from '../Scene';

describe('Scene', () => {
    it('renders with lib-scene class', () => {
        const { container } = render(<Scene />);
        expect(container.querySelector('.lib-scene')).toBeDefined();
    });

    it('renders grid by default', () => {
        const { container } = render(<Scene />);
        expect(container.querySelector('.lib-scene__grid')).toBeDefined();
    });

    it('does not render grid when grid=false', () => {
        const { container } = render(<Scene grid={false} />);
        expect(container.querySelector('.lib-scene__grid')).toBeNull();
    });

    it('renders scanlines by default', () => {
        const { container } = render(<Scene />);
        expect(container.querySelector('.lib-scene__scanlines')).toBeDefined();
    });

    it('does not render scanlines when scanlines=false', () => {
        const { container } = render(<Scene scanlines={false} />);
        expect(container.querySelector('.lib-scene__scanlines')).toBeNull();
    });

    it('renders stars by default (StarField inside)', () => {
        const { container } = render(<Scene />);
        expect(container.querySelector('.lib-starfield')).toBeDefined();
    });

    it('does not render stars when stars=false', () => {
        const { container } = render(<Scene stars={false} />);
        expect(container.querySelector('.lib-starfield')).toBeNull();
    });

    it('always renders vignette and noise and horizon', () => {
        const { container } = render(<Scene />);
        expect(container.querySelector('.lib-scene__vignette')).toBeDefined();
        expect(container.querySelector('.lib-scene__noise')).toBeDefined();
        expect(container.querySelector('.lib-scene__horizon')).toBeDefined();
    });

    it('renders 60 stars by default', () => {
        const { container } = render(<Scene />);
        expect(container.querySelectorAll('.lib-starfield__star')).toHaveLength(60);
    });

    it('passes starCount to the StarField', () => {
        const { container } = render(<Scene starCount={12} />);
        expect(container.querySelectorAll('.lib-starfield__star')).toHaveLength(12);
    });

    it('merges className', () => {
        const { container } = render(<Scene className="extra" />);
        expect(container.querySelector('.lib-scene')?.classList.contains('extra')).toBe(true);
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(join(process.cwd(), 'src/ui/primitives/Scene/Scene.css'), 'utf8');
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-scene__grid');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
