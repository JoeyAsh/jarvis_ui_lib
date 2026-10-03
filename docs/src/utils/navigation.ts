import { GROUP_ORDER, PAGES } from '../nav';
import type { DocsPage } from '../nav.types';
import type { NavListGroup } from '@ui';
import { hrefFor } from './paths';

/** Route slug for a router pathname (`/components/button/` → `components/button`). */
export function currentSlug(pathname: string): string {
    return pathname.replace(/^\/+|\/+$/g, '');
}

export function findPage(slug: string): DocsPage | undefined {
    return PAGES.find((p) => p.slug === slug);
}

/** Pages in reading order: ungrouped first, then by `GROUP_ORDER`. */
export function orderedPages(): DocsPage[] {
    const ungrouped = PAGES.filter((p) => p.group === undefined);
    const grouped = GROUP_ORDER.flatMap((g) => PAGES.filter((p) => p.group === g));
    return [...ungrouped, ...grouped];
}

/** Previous and next page relative to `slug`, for the page footer. */
export function neighbours(slug: string): { prev?: DocsPage; next?: DocsPage } {
    const pages = orderedPages();
    const index = pages.findIndex((p) => p.slug === slug);
    if (index === -1) return {};
    return { prev: pages[index - 1], next: pages[index + 1] };
}

/** Sidebar data for `NavList`; item ids are page slugs (`'home'` for the landing page). */
export function navGroups(): NavListGroup[] {
    const toItem = (p: DocsPage) => ({
        id: p.slug === '' ? 'home' : p.slug,
        label: p.title,
        href: hrefFor(p.slug),
    });
    const groups: NavListGroup[] = [
        { items: PAGES.filter((p) => p.group === undefined).map(toItem) },
    ];
    for (const group of GROUP_ORDER) {
        const items = PAGES.filter((p) => p.group === group).map(toItem);
        if (items.length > 0) groups.push({ label: group, items });
    }
    return groups;
}

/** NavList item id → route slug. */
export function slugFromNavId(id: string): string {
    return id === 'home' ? '' : id;
}
