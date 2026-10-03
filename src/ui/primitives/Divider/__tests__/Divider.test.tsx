import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from '../Divider';

describe('Divider', () => {
    it('renders a horizontal separator by default', () => {
        render(<Divider />);
        expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('renders a vertical separator', () => {
        render(<Divider orientation="vertical" />);
        const sep = screen.getByRole('separator');
        expect(sep.getAttribute('aria-orientation')).toBe('vertical');
        expect(sep.className).toContain('w-px');
    });

    it('renders a label', () => {
        render(<Divider label="Or" />);
        expect(screen.getByRole('separator').textContent).toContain('Or');
    });

    it('variant=accent uses the accent gradient', () => {
        render(<Divider variant="accent" />);
        expect(screen.getByRole('separator').className).toContain('via-accent-dim');
    });

    it('merges className', () => {
        render(<Divider className="my-4" />);
        expect(screen.getByRole('separator').className).toContain('my-4');
    });
});
