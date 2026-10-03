/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { GlowFrame } from '../GlowFrame';

describe('GlowFrame', () => {
    it('renders children', () => {
        render(
            <GlowFrame>
                <span>inner</span>
            </GlowFrame>,
        );
        expect(screen.getByText('inner')).toBeDefined();
    });

    it('has border class', () => {
        const { container } = render(<GlowFrame>x</GlowFrame>);
        expect(container.querySelector('div')?.className).toContain('border');
    });

    it('static mode uses the glow class without inline styles', () => {
        const { container } = render(<GlowFrame>x</GlowFrame>);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.classList.contains('lib-glow-frame')).toBe(true);
        expect(el.classList.contains('lib-glow-frame--strong')).toBe(false);
        expect(el.getAttribute('style')).toBeNull();
    });

    it('strong mode adds the strong modifier', () => {
        const { container } = render(<GlowFrame strong>x</GlowFrame>);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.classList.contains('lib-glow-frame--strong')).toBe(true);
    });

    it('breathe mode adds the breathe modifier and keeps the static glow as fallback', () => {
        const { container } = render(<GlowFrame breathe>x</GlowFrame>);
        const el = container.querySelector('div') as HTMLElement;
        expect(el.classList.contains('lib-glow-frame--breathe')).toBe(true);
        expect(el.classList.contains('lib-glow-frame')).toBe(true);
        expect(el.getAttribute('style')).toBeNull();
    });

    it('className merges', () => {
        const { container } = render(<GlowFrame className="extra">x</GlowFrame>);
        expect(container.querySelector('div')?.className).toContain('extra');
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(
            join(process.cwd(), 'src/ui/primitives/GlowFrame/GlowFrame.css'),
            'utf8',
        );
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-glow-frame--breathe');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
