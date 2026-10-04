import { LISTBOX_GAP, LISTBOX_MAX_H } from './constants';
import type { ListboxPosition, SelectOption } from './Select.types';

export { nextEnabledIndex } from '../RadioGroup/utils';

/**
 * Index of the first enabled option after `from` whose label starts with `query`
 * (case-insensitive), wrapping around; -1 when none matches.
 */
export function typeaheadIndex(options: SelectOption[], from: number, query: string): number {
    const q = query.toLowerCase();
    const n = options.length;
    for (let i = 1; i <= n; i++) {
        const idx = (from + i + n) % n;
        const option = options[idx];
        if (
            option !== undefined &&
            option.disabled !== true &&
            option.label.toLowerCase().startsWith(q)
        ) {
            return idx;
        }
    }
    return -1;
}

/** Where to place the list for a trigger at `rect` in a viewport of height `viewportH`. */
export function listboxPosition(rect: DOMRect, viewportH: number): ListboxPosition {
    const below = viewportH - rect.bottom;
    const above = below < LISTBOX_MAX_H + LISTBOX_GAP && rect.top > below;
    return {
        x: rect.left,
        y: above ? rect.top - LISTBOX_GAP : rect.bottom + LISTBOX_GAP,
        w: rect.width,
        above,
    };
}
