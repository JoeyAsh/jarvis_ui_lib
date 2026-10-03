/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { Scanlines } from '../Scanlines';

describe('Scanlines', () => {
    it('renders children', () => {
        render(
            <Scanlines>
                <span>content</span>
            </Scanlines>,
        );
        expect(screen.getByText('content')).toBeDefined();
    });

    it('renders the scanline overlay span', () => {
        const { container } = render(
            <Scanlines>
                <div>x</div>
            </Scanlines>,
        );
        expect(container.querySelector('.lib-scanlines__overlay')).not.toBeNull();
    });

    it('sweep=false renders no sweep span by default', () => {
        const { container } = render(
            <Scanlines>
                <div>x</div>
            </Scanlines>,
        );
        const spans = container.querySelectorAll('span[aria-hidden]');
        // Only the scanline span, no sweep wrapper
        expect(spans.length).toBe(1);
        expect(container.querySelector('.lib-scanlines__sweep')).toBeNull();
    });

    it('sweep=true renders additional sweep span', () => {
        const { container } = render(
            <Scanlines sweep>
                <div>x</div>
            </Scanlines>,
        );
        const spans = container.querySelectorAll('span[aria-hidden]');
        expect(spans.length).toBe(2);
        expect(container.querySelector('.lib-scanlines__sweep')).not.toBeNull();
    });

    it('uses no inline styles', () => {
        const { container } = render(
            <Scanlines sweep>
                <div>x</div>
            </Scanlines>,
        );
        expect(container.querySelectorAll('[style]')).toHaveLength(0);
    });

    it('hides overlay and sweep under reduced motion', () => {
        const { container } = render(
            <Scanlines sweep>
                <div>x</div>
            </Scanlines>,
        );
        container.querySelectorAll('span[aria-hidden]').forEach((span: Element) => {
            expect(span.className).toContain('motion-reduce:hidden');
        });
    });

    it('className merges on root', () => {
        const { container } = render(
            <Scanlines className="my-scanlines">
                <div>x</div>
            </Scanlines>,
        );
        expect(container.querySelector('div')?.className).toContain('my-scanlines');
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(
            join(process.cwd(), 'src/ui/primitives/Scanlines/Scanlines.css'),
            'utf8',
        );
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-scanlines__sweep');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
