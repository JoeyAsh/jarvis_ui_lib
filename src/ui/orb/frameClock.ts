import type { FrameClock } from './frameClock.types';

/**
 * Frame timing based on `performance.now()`.
 *
 * Replaces `THREE.Clock`, which is deprecated since three r183. `THREE.Timer` is only part of
 * three's core in newer releases, so using it would raise the `three` peer requirement; this keeps
 * every supported three version (>= 0.170) warning-free.
 */
export function createFrameClock(): FrameClock {
    const start = performance.now();
    let last = start;
    return {
        delta() {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;
            return dt;
        },
        elapsed() {
            return (performance.now() - start) / 1000;
        },
    };
}
