import type { MouseEvent, ReactNode } from 'react';

export interface NavListItem {
    /** Unique id of the entry; compared with `activeId`. */
    id: string;
    /** Visible text of the entry. */
    label: ReactNode;
    /** Link target. Entries are rendered as anchors so they work without JavaScript. */
    href: string;
    /** Optional trailing badge, e.g. a `Pill` saying "new". */
    badge?: ReactNode;
}

export interface NavListGroup {
    /** Group heading. Omit for an ungrouped block at the top. */
    label?: string;
    /** Entries in this group. */
    items: NavListItem[];
}

export interface NavListProps {
    /** Navigation groups in display order. */
    groups: NavListGroup[];
    /** Id of the current entry; it is highlighted and gets `aria-current="page"`. */
    activeId?: string;
    /**
     * Called when an entry is clicked, before the browser follows the link. Call
     * `event.preventDefault()` to handle navigation yourself (e.g. with a client-side router).
     */
    onItemClick?: (item: NavListItem, event: MouseEvent<HTMLAnchorElement>) => void;
    /** Accessible name of the `<nav>` landmark. @default 'Navigation' */
    'aria-label'?: string;
    className?: string;
}
