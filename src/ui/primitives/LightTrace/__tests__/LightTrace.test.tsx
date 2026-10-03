/// <reference types="node" />
// Node types: the stylesheet is read from disk (Vitest stubs CSS imports) to check the
// reduced-motion rule, which jsdom cannot evaluate.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { LightTrace } from '../LightTrace';

describe('LightTrace', () => {
    it('renders with lib-lighttrace class', () => {
        const { container } = render(<LightTrace />);
        expect(container.querySelector('.lib-lighttrace')).toBeDefined();
    });

    it('renders left and right strip elements', () => {
        const { container } = render(<LightTrace />);
        expect(container.querySelector('.lib-lighttrace__l')).toBeDefined();
        expect(container.querySelector('.lib-lighttrace__r')).toBeDefined();
    });

    it('merges className', () => {
        const { container } = render(<LightTrace className="extra" />);
        const root = container.querySelector('.lib-lighttrace');
        expect(root?.classList.contains('extra')).toBe(true);
    });

    it('applies custom color via CSS custom property', () => {
        const { container } = render(<LightTrace color="#ff0000" />);
        const root = container.querySelector<HTMLElement>('.lib-lighttrace');
        expect(root?.style.getPropertyValue('--lt-color')).toBe('#ff0000');
    });

    it('tints the center and glow with a custom color via the custom modifier', () => {
        const { container } = render(<LightTrace color="var(--warning)" />);
        const root = container.querySelector('.lib-lighttrace');
        expect(root?.classList.contains('lib-lighttrace--custom')).toBe(true);
    });

    it('keeps the default accent center without a color', () => {
        const { container } = render(<LightTrace />);
        const root = container.querySelector<HTMLElement>('.lib-lighttrace');
        expect(root?.classList.contains('lib-lighttrace--custom')).toBe(false);
        expect(root?.getAttribute('style')).toBeNull();
    });

    it('has aria-hidden for decorative use', () => {
        const { container } = render(<LightTrace />);
        expect(container.querySelector('.lib-lighttrace')?.getAttribute('aria-hidden')).toBe(
            'true',
        );
    });

    it('stops its animation under prefers-reduced-motion', () => {
        const css = readFileSync(
            join(process.cwd(), 'src/ui/primitives/LightTrace/LightTrace.css'),
            'utf8',
        );
        const reduced = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toContain('.lib-lighttrace__l');
        expect(reduced).toMatch(/animation:\s*none/);
    });
});
