import type { TabItem } from './Tabs.types';

/** Value of the first tab that is not disabled, or an empty string when there is none. */
export function firstEnabledValue(items: TabItem[]): string {
    return items.find((t) => t.disabled !== true)?.value ?? '';
}

/**
 * Index of the next enabled tab from `from`, moving by `step` (+1 / -1) and wrapping around.
 * Returns `from` when no other tab is enabled.
 */
export function nextEnabledIndex(items: TabItem[], from: number, step: 1 | -1): number {
    const n = items.length;
    for (let i = 1; i <= n; i++) {
        const idx = (from + step * i + n) % n;
        if (items[idx]?.disabled !== true) return idx;
    }
    return from;
}
