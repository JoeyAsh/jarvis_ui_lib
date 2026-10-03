import type { NavListGroup } from '../compositions/NavList';
import type { NavItem } from './Showcase.types';

/** Groups the flat showcase NAV list into consecutive `NavList` groups (`null` group = no heading). */
export function buildNavGroups(items: NavItem[]): NavListGroup[] {
    const groups: NavListGroup[] = [];
    for (const item of items) {
        const label = item.group ?? undefined;
        const last = groups.length > 0 ? groups[groups.length - 1] : undefined;
        const entry = { id: item.id, label: item.label, href: `#${item.id}` };
        if (last && last.label === label) {
            last.items.push(entry);
        } else {
            groups.push({ label, items: [entry] });
        }
    }
    return groups;
}

/** Returns the id of the last section whose top edge has scrolled past `offset` px. */
export function findActiveSection(ids: string[], offset: number): string | undefined {
    let active = ids[0];
    for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) active = id;
    }
    return active;
}
