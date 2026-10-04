/** URL of the YouTube IFrame Player API script. */
export const YT_API_URL = 'https://www.youtube.com/iframe_api';

/** Player host for privacy-enhanced mode. */
export const YT_NOCOOKIE_HOST = 'https://www.youtube-nocookie.com';

/** How often (ms) the playing time is polled; the IFrame API has no `timeupdate` event. */
export const YT_POLL_MS = 250;

/** `YT.PlayerState` values. */
export const YT_STATE = { ended: 0, playing: 1, paused: 2, buffering: 3 } as const;

/** Error codes for videos whose owner does not allow embedding. */
export const YT_EMBED_BLOCKED = [101, 150] as const;
