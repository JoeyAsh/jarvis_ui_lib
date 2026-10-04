import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';
import { Grid } from '../Grid';

function root(container: HTMLElement): HTMLElement {
    const el = container.firstElementChild;
    if (!(el instanceof HTMLElement)) throw new Error('no root');
    return el;
}

describe('Grid', () => {
    it('fits auto columns of minColumnWidth by default', () => {
        const { container } = render(
            <Grid minColumnWidth={200}>
                <span>A</span>
            </Grid>,
        );
        const el = root(container);
        expect(el.className).toContain('grid');
        expect(el.className).toContain('auto-fill');
        expect(el.style.getPropertyValue('--grid-min')).toBe('200px');
    });

    it('uses a fixed column count without the width variable', () => {
        const { container } = render(<Grid columns={3} gap="sm" align="center" />);
        const el = root(container);
        expect(el.className).toContain('grid-cols-3');
        expect(el.className).toContain('gap-[var(--s-2)]');
        expect(el.className).toContain('items-center');
        expect(el.style.getPropertyValue('--grid-min')).toBe('');
    });

    it('passes attributes, className and ref to the root', () => {
        const ref = createRef<HTMLDivElement>();
        const { container } = render(<Grid ref={ref} className="mt-2" data-testid="g" />);
        expect(ref.current).toBe(root(container));
        expect(root(container).className).toContain('mt-2');
        expect(root(container).dataset.testid).toBe('g');
    });
});
