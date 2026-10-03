import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Icon } from '../Icon';
import { Mic } from 'lucide-react';

describe('Icon', () => {
    it('renders an svg element', () => {
        const { container } = render(<Icon icon={Mic} />);
        expect(container.querySelector('svg')).toBeDefined();
    });

    it('default size md renders 14px dimensions', () => {
        const { container } = render(<Icon icon={Mic} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('14');
        expect(svg?.getAttribute('height')).toBe('14');
    });

    it('size sm renders 12px', () => {
        const { container } = render(<Icon icon={Mic} size="sm" />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('12');
    });

    it('size lg renders 16px', () => {
        const { container } = render(<Icon icon={Mic} size="lg" />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('width')).toBe('16');
    });

    it('aria-label is passed through', () => {
        const { container } = render(<Icon icon={Mic} aria-label="microphone" />);
        expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('microphone');
    });

    it('className merges', () => {
        const { container } = render(<Icon icon={Mic} className="text-accent" />);
        expect(container.querySelector('svg')?.getAttribute('class')).toContain('text-accent');
    });

    it('is decorative by default (aria-hidden, no role)', () => {
        const { container } = render(<Icon icon={Mic} />);
        const svg = container.querySelector('svg');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
        expect(svg?.getAttribute('role')).toBeNull();
    });

    it('with aria-label gets role img and is not hidden', () => {
        render(<Icon icon={Mic} aria-label="microphone" />);
        const svg = screen.getByRole('img', { name: 'microphone' });
        expect(svg.getAttribute('aria-hidden')).toBeNull();
    });

    it('explicit aria-hidden wins over the default', () => {
        const { container } = render(<Icon icon={Mic} aria-hidden={false} />);
        expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('false');
    });

    it('does not add an empty class attribute value by default', () => {
        const { container } = render(<Icon icon={Mic} />);
        expect(container.querySelector('svg')?.getAttribute('class') ?? '').not.toMatch(/\s$/);
    });
});
