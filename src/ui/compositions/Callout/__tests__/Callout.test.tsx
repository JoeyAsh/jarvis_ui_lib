import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Star } from 'lucide-react';
import { Callout } from '../Callout';

describe('Callout', () => {
    it('renders a note with body text', () => {
        render(<Callout>Import the stylesheet once.</Callout>);
        expect(screen.getByRole('note').textContent).toContain('Import the stylesheet once.');
    });

    it('renders a title', () => {
        render(<Callout title="Note">Body</Callout>);
        expect(screen.getByText('Note')).toBeDefined();
    });

    it.each([
        ['info', 'border-l-accent'],
        ['success', 'border-l-success'],
        ['warning', 'border-l-warning'],
        ['error', 'border-l-error'],
    ] as const)('variant=%s uses %s', (variant, cls) => {
        render(<Callout variant={variant}>Body</Callout>);
        expect(screen.getByRole('note').className).toContain(cls);
    });

    it('renders the default icon as decorative', () => {
        const { container } = render(<Callout>Body</Callout>);
        expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('icon=false hides the icon, a custom icon replaces it', () => {
        const { container, rerender } = render(<Callout icon={false}>Body</Callout>);
        expect(container.querySelector('svg')).toBeNull();
        rerender(<Callout icon={Star}>Body</Callout>);
        expect(container.querySelector('svg')?.getAttribute('class')).toContain('lucide-star');
    });

    it('merges className', () => {
        render(<Callout className="extra">Body</Callout>);
        expect(screen.getByRole('note').className).toContain('extra');
    });
});
