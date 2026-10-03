/// <reference types="node" />
// Node types are referenced for reading the stylesheet (Vitest stubs CSS imports).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { HUDShell } from '../HUDShell';

// Mock requestAnimationFrame for any RAF-driven components inside
let rafId = 0;
beforeEach(() => {
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((_cb) => {
        rafId++;
        // Don't call _cb — keep animations inert in tests
        return rafId;
    });
    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => undefined);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('HUDShell', () => {
    it('renders without crashing', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.hud-shell')).toBeDefined();
    });

    it('renders Scene by default', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.lib-scene')).toBeDefined();
    });

    it('renders Reactor by default', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.lib-reactor')).toBeDefined();
    });

    it('renders ViewportCorners by default', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.lib-viewport-corner')).toBeDefined();
    });

    it('omits Reactor when reactor=false', () => {
        const { container } = render(<HUDShell reactor={false} />);
        expect(container.querySelector('.lib-reactor')).toBeNull();
    });

    it('omits ViewportCorners when viewportCorners=false', () => {
        const { container } = render(<HUDShell viewportCorners={false} />);
        expect(container.querySelector('.lib-viewport-corner')).toBeNull();
    });

    it('adds idle class when idle=true', () => {
        const { container } = render(<HUDShell idle />);
        expect(container.querySelector('.hud-shell')?.classList.contains('idle')).toBe(true);
    });

    it('does not have idle class by default', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.hud-shell')?.classList.contains('idle')).toBe(false);
    });

    it('adds is-working class when working=true', () => {
        const { container } = render(<HUDShell working />);
        expect(container.querySelector('.hud-shell')?.classList.contains('is-working')).toBe(true);
    });

    it('renders topbar slot', () => {
        const { getByText } = render(<HUDShell topbar={<div>TOP BAR</div>} />);
        expect(getByText('TOP BAR')).toBeDefined();
    });

    it('renders orb slot', () => {
        const { getByText } = render(<HUDShell orb={<div>ORB</div>} />);
        expect(getByText('ORB')).toBeDefined();
    });

    it('renders children slot', () => {
        const { getByText } = render(
            <HUDShell>
                <div>PANEL</div>
            </HUDShell>,
        );
        expect(getByText('PANEL')).toBeDefined();
    });

    it('renders dock slot', () => {
        const { getByText } = render(<HUDShell dock={<div>DOCK</div>} />);
        expect(getByText('DOCK')).toBeDefined();
    });

    it('merges className', () => {
        const { container } = render(<HUDShell className="extra" />);
        expect(container.querySelector('.hud-shell')?.classList.contains('extra')).toBe(true);
    });

    it('makes the children layer inert while idle', () => {
        const { container } = render(
            <HUDShell idle>
                <button type="button">Panel action</button>
            </HUDShell>,
        );
        const layer = container.querySelector('.hud-shell__children');
        expect(layer?.hasAttribute('inert')).toBe(true);
    });

    it('keeps the children layer interactive when not idle', () => {
        const { container, rerender } = render(
            <HUDShell idle>
                <button type="button">Panel action</button>
            </HUDShell>,
        );
        rerender(
            <HUDShell idle={false}>
                <button type="button">Panel action</button>
            </HUDShell>,
        );
        expect(container.querySelector('.hud-shell__children')?.hasAttribute('inert')).toBe(false);
        expect(screen.getByRole('button', { name: 'Panel action' })).toBeDefined();
    });

    it('does not add is-working by default', () => {
        const { container } = render(<HUDShell />);
        expect(container.querySelector('.hud-shell')?.classList.contains('is-working')).toBe(false);
    });
});

describe('HUDShell stylesheet', () => {
    const css = readFileSync(
        join(process.cwd(), 'src/ui/compositions/HUDShell/HUDShell.css'),
        'utf8',
    );

    it('gives is-working a visible, animated effect', () => {
        expect(css).toMatch(/\.hud-shell\.is-working::before\s*\{[^}]*animation:\s*jlib-sweep-x/);
        expect(css).toMatch(/\.hud-shell\.is-working::after\s*\{[^}]*box-shadow:/);
    });

    it('turns the working animation off under prefers-reduced-motion', () => {
        const reduced = css.slice(css.indexOf('prefers-reduced-motion'));
        expect(reduced).toMatch(/\.hud-shell\.is-working::before\s*\{[^}]*animation:\s*none/);
    });

    it('transitions panels in both directions (transition on the non-idle selector)', () => {
        expect(css).toMatch(
            /\.hud-shell > \.hud-shell__children \.lib-panel\s*\{[^}]*opacity 0\.35s/,
        );
    });
});
