import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Stack } from '../Stack';

function root(container: HTMLElement): HTMLElement {
    const el = container.firstElementChild;
    if (!(el instanceof HTMLElement)) throw new Error('no root');
    return el;
}

describe('Stack', () => {
    it('renders its children in a column with the md gap by default', () => {
        const { container } = render(
            <Stack>
                <span>A</span>
                <span>B</span>
            </Stack>,
        );
        expect(screen.getByText('A')).toBeDefined();
        const cls = root(container).className;
        expect(cls).toContain('flex-col');
        expect(cls).toContain('gap-[var(--s-3)]');
        expect(cls).toContain('items-stretch');
    });

    it('maps direction, gap, align, justify and wrap', () => {
        const { container } = render(
            <Stack direction="row" gap="lg" align="center" justify="between" wrap>
                <span>A</span>
            </Stack>,
        );
        const cls = root(container).className;
        for (const expected of [
            'flex-row',
            'gap-[var(--s-5)]',
            'items-center',
            'justify-between',
            'flex-wrap',
        ]) {
            expect(cls).toContain(expected);
        }
    });

    it('passes attributes, className and ref to the root', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(
            <Stack ref={ref} className="mt-2" role="list" aria-label="Items" gap="none" />,
        );
        expect(ref.current).toBe(root(container));
        expect(screen.getByRole('list', { name: 'Items' })).toBeDefined();
        expect(root(container).className).toContain('mt-2');
        expect(root(container).className).toContain('gap-0');
    });
});
