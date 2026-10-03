import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Link } from '../Link';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('Link', () => {
    it('renders an anchor with href', () => {
        render(<Link href="/docs">Docs</Link>);
        expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('href')).toBe('/docs');
    });

    it('external opens in a new tab safely and shows an icon', () => {
        const { container } = render(
            <Link href="https://example.com" external>
                Site
            </Link>,
        );
        const a = screen.getByRole('link');
        expect(a.getAttribute('target')).toBe('_blank');
        expect(a.getAttribute('rel')).toBe('noopener noreferrer');
        expect(container.querySelector('svg')).not.toBeNull();
    });

    it('active sets aria-current=page', () => {
        render(
            <Link href="/a" active>
                A
            </Link>,
        );
        expect(screen.getByRole('link').getAttribute('aria-current')).toBe('page');
    });

    it('variant=nav uses the nav class', () => {
        render(
            <Link href="/a" variant="nav">
                A
            </Link>,
        );
        expect(screen.getByRole('link').className).toContain('lib-link--nav');
    });

    it('merges className', () => {
        render(
            <Link href="/a" className="extra">
                A
            </Link>,
        );
        expect(screen.getByRole('link').className).toContain('extra');
    });

    it('fires onClick and plays click', () => {
        const sfx = makeSfx();
        const onClick = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
        renderWithSfx(
            sfx,
            <Link href="/a" onClick={onClick}>
                A
            </Link>,
        );
        fireEvent.click(screen.getByRole('link'));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });
});
