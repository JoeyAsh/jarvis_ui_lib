/**
 * Index of the next enabled item from `from`, moving by `step` (+1 / -1) and wrapping around.
 * Returns `from` when no other item is enabled.
 */
export function nextEnabledIndex(
    items: readonly { disabled?: boolean }[],
    from: number,
    step: 1 | -1,
): number {
    const n = items.length;
    for (let i = 1; i <= n; i++) {
        const idx = (from + step * i + n) % n;
        if (items[idx]?.disabled !== true) return idx;
    }
    return from;
}
