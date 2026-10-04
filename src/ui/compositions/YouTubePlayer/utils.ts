import { YT_API_URL } from './constants';
import type { YTNamespace, YTWindow } from './YouTubePlayer.types';

let apiPromise: Promise<YTNamespace> | null = null;

function ytWindow(): Window & YTWindow {
    return window;
}

/**
 * Loads the YouTube IFrame Player API once and resolves with the `YT` namespace. Later calls
 * share the same promise; an existing `window.YT` (e.g. loaded by the app) is reused.
 */
export function loadYouTubeApi(): Promise<YTNamespace> {
    const w = ytWindow();
    if (w.YT?.Player !== undefined) return Promise.resolve(w.YT);
    if (apiPromise !== null) return apiPromise;

    apiPromise = new Promise<YTNamespace>((resolve, reject) => {
        const previous = w.onYouTubeIframeAPIReady;
        w.onYouTubeIframeAPIReady = () => {
            previous?.();
            if (w.YT !== undefined) resolve(w.YT);
        };
        const script = document.createElement('script');
        script.src = YT_API_URL;
        script.async = true;
        script.onerror = () => {
            apiPromise = null;
            reject(new Error('Failed to load the YouTube IFrame API'));
        };
        document.head.appendChild(script);
    });
    return apiPromise;
}

/** Forgets the cached loader; for tests. */
export function resetYouTubeApiForTests(): void {
    apiPromise = null;
}

/** Link to the video on youtube.com, for the fallback when embedding is not allowed. */
export function watchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
}
