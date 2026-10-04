import { PAGE_STEPS } from './constants';

/** Number of decimals of `step`, so snapped values don't carry float noise (0.1 + 0.2). */
function decimalsOf(step: number): number {
    const text = String(step);
    const dot = text.indexOf('.');
    return dot === -1 ? 0 : text.length - dot - 1;
}

/** Clamps `value` to `[min, max]` and rounds it to the nearest multiple of `step` from `min`. */
export function snapValue(value: number, min: number, max: number, step: number): number {
    const clamped = Math.min(max, Math.max(min, value));
    if (step <= 0) return clamped;
    const snapped = min + Math.round((clamped - min) / step) * step;
    return Number(Math.min(max, snapped).toFixed(decimalsOf(step)));
}

/** Position of `value` on the track as a percentage (0–100). */
export function toPercent(value: number, min: number, max: number): number {
    if (max <= min) return 0;
    return ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
}

/** Value under a pointer at `clientX` on a track spanning `left`…`left + width`. */
export function valueFromPointer(
    clientX: number,
    left: number,
    width: number,
    min: number,
    max: number,
    step: number,
): number {
    const ratio = width > 0 ? (clientX - left) / width : 0;
    return snapValue(min + ratio * (max - min), min, max, step);
}

/** Value after a key press, or `null` when the key does not move a slider. */
export function valueFromKey(
    key: string,
    value: number,
    min: number,
    max: number,
    step: number,
): number | null {
    switch (key) {
        case 'ArrowRight':
        case 'ArrowUp':
            return snapValue(value + step, min, max, step);
        case 'ArrowLeft':
        case 'ArrowDown':
            return snapValue(value - step, min, max, step);
        case 'PageUp':
            return snapValue(value + step * PAGE_STEPS, min, max, step);
        case 'PageDown':
            return snapValue(value - step * PAGE_STEPS, min, max, step);
        case 'Home':
            return min;
        case 'End':
            return max;
        default:
            return null;
    }
}
