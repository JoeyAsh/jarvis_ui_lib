/** Whether a duration is a known, finite length (not loading, not live). */
export function isFiniteDuration(duration: number): boolean {
    return Number.isFinite(duration) && duration > 0;
}

/**
 * Formats seconds as a media clock: `m:ss`, or `h:mm:ss` from one hour on. Invalid values give
 * `0:00`.
 *
 * @example
 * formatClock(83)   // "1:23"
 * formatClock(3725) // "1:02:05"
 */
export function formatClock(seconds: number): string {
    const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = String(total % 60).padStart(2, '0');
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}
