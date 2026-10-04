import type { MediaState } from './MediaPlayer.types';

/** The element's duration: seconds, `Infinity` for live streams, `0` while unknown (`NaN`). */
export function durationOf(el: HTMLMediaElement): number {
    return Number.isNaN(el.duration) ? 0 : el.duration;
}

/**
 * The state a media element is in right now. Read when the listeners attach: the element may have
 * loaded its metadata already (e.g. from cache), so `loadedmetadata` fired before anyone listened.
 */
export function readMediaState(el: HTMLMediaElement): Partial<MediaState> {
    return {
        currentTime: el.currentTime,
        duration: durationOf(el),
        volume: el.volume,
        muted: el.muted,
        loading: el.readyState < HTMLMediaElement.HAVE_FUTURE_DATA && !el.error,
        // `!el.error` rather than `=== null`: some environments report `undefined` without an error.
        error: Boolean(el.error),
    };
}
