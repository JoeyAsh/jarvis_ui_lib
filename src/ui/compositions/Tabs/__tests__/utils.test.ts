import { describe, it, expect } from 'vitest';
import { firstEnabledValue, nextEnabledIndex } from '../utils';
import type { TabItem } from '../Tabs.types';

const ITEMS: TabItem[] = [
    { value: 'a', label: 'A', content: null, disabled: true },
    { value: 'b', label: 'B', content: null },
    { value: 'c', label: 'C', content: null, disabled: true },
    { value: 'd', label: 'D', content: null },
];

describe('Tabs utils', () => {
    it('firstEnabledValue skips disabled tabs', () => {
        expect(firstEnabledValue(ITEMS)).toBe('b');
    });

    it('firstEnabledValue returns empty string when all are disabled', () => {
        expect(firstEnabledValue([{ value: 'x', label: 'X', content: null, disabled: true }])).toBe(
            '',
        );
    });

    it('nextEnabledIndex wraps and skips disabled tabs', () => {
        expect(nextEnabledIndex(ITEMS, 1, 1)).toBe(3);
        expect(nextEnabledIndex(ITEMS, 3, 1)).toBe(1);
        expect(nextEnabledIndex(ITEMS, 1, -1)).toBe(3);
    });

    it('nextEnabledIndex returns from when nothing else is enabled', () => {
        const single: TabItem[] = [{ value: 'only', label: 'O', content: null }];
        expect(nextEnabledIndex(single, 0, 1)).toBe(0);
    });
});
