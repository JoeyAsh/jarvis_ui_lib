import { CHROME_HEIGHT, LINE_HEIGHT } from './constants';
import type { TextareaSize } from './Textarea.types';

/**
 * Height for `autoResize`: the content height (`scrollHeight`) clamped between `rows` and
 * `maxRows` lines.
 */
export function autoHeight(
    scrollHeight: number,
    rows: number,
    maxRows: number,
    size: TextareaSize,
): number {
    const min = rows * LINE_HEIGHT[size] + CHROME_HEIGHT[size];
    const max = Math.max(rows, maxRows) * LINE_HEIGHT[size] + CHROME_HEIGHT[size];
    return Math.min(max, Math.max(min, scrollHeight + 2));
}
