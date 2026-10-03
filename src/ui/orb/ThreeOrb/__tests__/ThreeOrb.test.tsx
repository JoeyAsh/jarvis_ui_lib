import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThreeOrb } from '../ThreeOrb';

const engine = vi.hoisted(() => ({
    setState: vi.fn(),
    destroy: vi.fn(),
}));

vi.mock('../../orbEngine', () => ({
    createOrb: vi.fn(() => engine),
}));

afterEach(() => {
    vi.clearAllMocks();
});

describe('ThreeOrb', () => {
    it('renders a decorative canvas by default', () => {
        const { container } = render(<ThreeOrb state="idle" />);
        const canvas = container.querySelector('canvas');
        expect(canvas).not.toBeNull();
        expect(canvas?.getAttribute('aria-hidden')).toBe('true');
        expect(canvas?.getAttribute('role')).toBeNull();
    });

    it('exposes role="img" with the given aria-label', () => {
        const { getByRole } = render(<ThreeOrb state="idle" aria-label="Assistant idle" />);
        const img = getByRole('img', { name: 'Assistant idle' });
        expect(img.tagName).toBe('CANVAS');
        expect(img.getAttribute('aria-hidden')).toBeNull();
    });

    it('maps working to thinking for the engine', () => {
        render(<ThreeOrb state="working" />);
        expect(engine.setState).toHaveBeenCalledWith('thinking');
    });

    it('destroys the engine on unmount', () => {
        const { unmount } = render(<ThreeOrb state="idle" />);
        unmount();
        expect(engine.destroy).toHaveBeenCalled();
    });

    it('merges className onto the canvas', () => {
        const { container } = render(<ThreeOrb state="idle" className="extra" />);
        expect(container.querySelector('canvas')?.classList.contains('extra')).toBe(true);
    });
});
