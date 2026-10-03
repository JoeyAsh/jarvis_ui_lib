import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mono } from '../Mono';

describe('Mono', () => {
    it('renders children', () => {
        render(<Mono>hello</Mono>);
        expect(screen.getByText('hello')).toBeDefined();
    });

    it('default size md gives text-[11px]', () => {
        const { container } = render(<Mono>x</Mono>);
        expect(container.querySelector('span')?.className).toContain('text-[11px]');
    });

    it('size xs gives text-[9px]', () => {
        const { container } = render(<Mono size="xs">x</Mono>);
        expect(container.querySelector('span')?.className).toContain('text-[9px]');
    });

    it('muted prop gives text-text-muted', () => {
        const { container } = render(<Mono muted>x</Mono>);
        expect(container.querySelector('span')?.className).toContain('text-text-muted');
    });

    it('secondary prop gives text-text-secondary', () => {
        const { container } = render(<Mono secondary>x</Mono>);
        expect(container.querySelector('span')?.className).toContain('text-text-secondary');
    });

    it('className merges', () => {
        const { container } = render(<Mono className="my-class">x</Mono>);
        expect(container.querySelector('span')?.className).toContain('my-class');
        expect(container.querySelector('span')?.className).toContain('font-mono');
    });

    it('forwards native attributes to the root', () => {
        render(
            <Mono id="m" title="Mono text" aria-live="polite" data-testid="mono">
                x
            </Mono>,
        );
        const el = screen.getByTestId('mono');
        expect(el.id).toBe('m');
        expect(el.getAttribute('title')).toBe('Mono text');
        expect(el.getAttribute('aria-live')).toBe('polite');
    });

    it('passes attributes through the as element (dateTime on time)', () => {
        render(
            <Mono as="time" dateTime="2026-10-03T09:04:17Z">
                09:04:17Z
            </Mono>,
        );
        const el = screen.getByText('09:04:17Z');
        expect(el.tagName).toBe('TIME');
        expect(el.getAttribute('datetime')).toBe('2026-10-03T09:04:17Z');
        expect(el.className).toContain('font-mono');
    });
});
