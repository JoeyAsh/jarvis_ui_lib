import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { NavList } from '../NavList';
import type { NavListGroup } from '../NavList.types';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

const GROUPS: NavListGroup[] = [
    { items: [{ id: 'overview', label: 'Overview', href: '/' }] },
    {
        label: 'Components',
        items: [
            { id: 'button', label: 'Button', href: '/components/button' },
            { id: 'input', label: 'Input', href: '/components/input', badge: <span>NEW</span> },
        ],
    },
];

describe('NavList', () => {
    it('renders a nav landmark with the given label', () => {
        render(<NavList groups={GROUPS} aria-label="Docs" />);
        expect(screen.getByRole('navigation', { name: 'Docs' })).toBeDefined();
    });

    it('renders group labels, links and badges', () => {
        render(<NavList groups={GROUPS} />);
        expect(screen.getByText('Components')).toBeDefined();
        expect(screen.getByRole('link', { name: 'Button' }).getAttribute('href')).toBe(
            '/components/button',
        );
        expect(screen.getByText('NEW')).toBeDefined();
    });

    it('marks the active entry with aria-current', () => {
        render(<NavList groups={GROUPS} activeId="button" />);
        const active = screen.getByRole('link', { name: 'Button' });
        expect(active.getAttribute('aria-current')).toBe('page');
        expect(active.className).toContain('lib-navlist__item--active');
        expect(screen.getByRole('link', { name: 'Overview' }).getAttribute('aria-current')).toBe(
            null,
        );
    });

    it('calls onItemClick with the item and lets it prevent navigation', () => {
        const onItemClick = vi.fn((_item: unknown, e: { preventDefault: () => void }) =>
            e.preventDefault(),
        );
        render(<NavList groups={GROUPS} onItemClick={onItemClick} />);
        fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
        expect(onItemClick).toHaveBeenCalledTimes(1);
        expect(onItemClick.mock.calls[0]?.[0]).toEqual(GROUPS[0]?.items[0]);
    });

    it('merges className', () => {
        render(<NavList groups={GROUPS} className="extra" />);
        expect(screen.getByRole('navigation').className).toContain('extra');
    });

    it('plays hover and click sounds', () => {
        const sfx = makeSfx();
        renderWithSfx(sfx, <NavList groups={GROUPS} onItemClick={(_i, e) => e.preventDefault()} />);
        const link = screen.getByRole('link', { name: 'Button' });
        fireEvent.mouseEnter(link);
        fireEvent.click(link);
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });
});
