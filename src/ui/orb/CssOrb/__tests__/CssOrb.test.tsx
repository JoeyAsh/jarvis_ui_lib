import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { CssOrb as Orb } from '../CssOrb';

// Mock RAF / CAF with vi.fn() spies
let rafMock: ReturnType<typeof vi.fn>;
let cafMock: ReturnType<typeof vi.fn>;
let rafId = 0;

/** Stubs `window.matchMedia` so `(prefers-reduced-motion: reduce)` reports `reduced`. */
function mockReducedMotion(reduced: boolean): { fireChange: (next: boolean) => void } {
    let listener: (() => void) | null = null;
    const mql = {
        matches: reduced,
        media: '(prefers-reduced-motion: reduce)',
        addEventListener: vi.fn((_type: string, cb: () => void) => {
            listener = cb;
        }),
        removeEventListener: vi.fn(),
    };
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => mql),
    );
    return {
        fireChange: (next: boolean) => {
            mql.matches = next;
            listener?.();
        },
    };
}

beforeEach(() => {
    rafId = 0;
    rafMock = vi.fn((_cb: (t: number) => void) => {
        rafId += 1;
        return rafId;
    });
    cafMock = vi.fn();
    vi.stubGlobal('requestAnimationFrame', rafMock);
    vi.stubGlobal('cancelAnimationFrame', cafMock);
    mockReducedMotion(false);
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('Orb', () => {
    it('renders without crashing in idle state', () => {
        const { container } = render(<Orb state="idle" />);
        expect(container.querySelector('.orb-wrap')).toBeTruthy();
    });

    it('renders without crashing in listening state', () => {
        const { container } = render(<Orb state="listening" />);
        expect(container.querySelector('.orb-wrap')).toBeTruthy();
    });

    it('renders without crashing in thinking state', () => {
        const { container } = render(<Orb state="thinking" />);
        expect(container.querySelector('.orb-wrap')).toBeTruthy();
    });

    it('renders without crashing in speaking state', () => {
        const { container } = render(<Orb state="speaking" />);
        expect(container.querySelector('.orb-wrap')).toBeTruthy();
    });

    it('renders without crashing in working state', () => {
        const { container } = render(<Orb state="working" />);
        expect(container.querySelector('.orb-wrap')).toBeTruthy();
    });

    it('applies state class to the orb core', () => {
        const { container } = render(<Orb state="thinking" />);
        expect(container.querySelector('.orb.state-thinking')).toBeTruthy();
    });

    it('applies is-working class to orb-wrap when state is working', () => {
        const { container } = render(<Orb state="working" />);
        expect(container.querySelector('.orb-wrap.is-working')).toBeTruthy();
    });

    it('does NOT apply is-working when state is not working', () => {
        const { container } = render(<Orb state="idle" />);
        expect(container.querySelector('.orb-wrap.is-working')).toBeNull();
    });

    it('renders particles by default', () => {
        const { container } = render(<Orb state="idle" />);
        expect(container.querySelectorAll('.particle').length).toBe(6);
    });

    it('hides particles when particles={false}', () => {
        const { container } = render(<Orb state="idle" particles={false} />);
        expect(container.querySelectorAll('.particle').length).toBe(0);
    });

    it('injects particle size and color as CSS variables', () => {
        const { container } = render(<Orb state="idle" />);
        const particle = container.querySelector<HTMLElement>('.particle');
        expect(particle?.style.getPropertyValue('--particle-size')).toBe('3px');
        expect(particle?.style.getPropertyValue('--particle-color')).toBe('var(--accent-bright)');
        expect(particle?.style.width).toBe('');
        expect(particle?.style.background).toBe('');
    });

    it('injects tick angles as CSS variables', () => {
        const { container } = render(<Orb state="idle" />);
        const ticks = container.querySelectorAll<HTMLElement>('.orb-ring-ticks i');
        expect(ticks[1]?.style.getPropertyValue('--tick-angle')).toBe('10deg');
        expect(ticks[1]?.style.transform).toBe('');
    });

    it('starts RAF when particles are enabled', () => {
        render(<Orb state="idle" particles />);
        expect(rafMock).toHaveBeenCalled();
    });

    it('cancels RAF on unmount', () => {
        const { unmount } = render(<Orb state="idle" particles />);
        act(() => {
            unmount();
        });
        expect(cafMock).toHaveBeenCalled();
    });

    it('does not start RAF when particles are disabled', () => {
        rafMock.mockClear();
        render(<Orb state="idle" particles={false} />);
        expect(rafMock).not.toHaveBeenCalled();
    });

    it('skips the RAF loop under prefers-reduced-motion and parks the particles', () => {
        mockReducedMotion(true);
        const { container } = render(<Orb state="idle" />);
        expect(rafMock).not.toHaveBeenCalled();
        container.querySelectorAll<HTMLElement>('.particle').forEach((p) => {
            expect(p.style.transform).toMatch(/^translate\(/);
        });
    });

    it('starts and stops the loop when the reduced-motion preference changes', () => {
        const media = mockReducedMotion(true);
        render(<Orb state="idle" />);
        expect(rafMock).not.toHaveBeenCalled();

        act(() => media.fireChange(false));
        expect(rafMock).toHaveBeenCalledTimes(1);

        act(() => media.fireChange(true));
        expect(cafMock).toHaveBeenCalled();
    });

    it('runs the loop when matchMedia is unavailable', () => {
        vi.stubGlobal('matchMedia', undefined);
        render(<Orb state="idle" />);
        expect(rafMock).toHaveBeenCalled();
    });

    it('is decorative (aria-hidden, no role) by default', () => {
        const { container } = render(<Orb state="idle" />);
        const root = container.querySelector('.orb-wrap');
        expect(root?.getAttribute('aria-hidden')).toBe('true');
        expect(root?.getAttribute('role')).toBeNull();
        expect(root?.getAttribute('aria-label')).toBeNull();
    });

    it('exposes role="img" with the given aria-label', () => {
        const { getByRole } = render(<Orb state="speaking" aria-label="Assistant speaking" />);
        const img = getByRole('img', { name: 'Assistant speaking' });
        expect(img.classList.contains('orb-wrap')).toBe(true);
        expect(img.getAttribute('aria-hidden')).toBeNull();
    });

    it('merges className onto wrapper', () => {
        const { container } = render(<Orb state="idle" className="my-orb" />);
        expect(container.querySelector('.orb-wrap')?.className).toContain('my-orb');
    });

    it('renders 3 pulse rings', () => {
        const { container } = render(<Orb state="idle" />);
        const pulses = container.querySelectorAll('.pulse');
        expect(pulses.length).toBe(3);
    });

    it('renders rings by default', () => {
        const { container } = render(<Orb state="idle" />);
        expect(container.querySelectorAll('.orb-ring').length).toBeGreaterThanOrEqual(5);
        expect(container.querySelector('.orb-ring-ticks')).toBeTruthy();
    });

    it('hides rings when rings={false}', () => {
        const { container } = render(<Orb state="idle" rings={false} />);
        expect(container.querySelectorAll('.orb-ring').length).toBe(0);
        expect(container.querySelector('.orb-ring-ticks')).toBeNull();
    });

    it('renders 36 tick marks inside ring-ticks', () => {
        const { container } = render(<Orb state="idle" />);
        const ticks = container.querySelectorAll('.orb-ring-ticks i');
        expect(ticks).toHaveLength(36);
    });
});
