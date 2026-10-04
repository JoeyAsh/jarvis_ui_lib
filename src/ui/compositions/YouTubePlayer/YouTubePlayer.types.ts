import type { ReactNode } from 'react';
import type { MediaControlsSize } from '../MediaControls/MediaControls.types';

/** Props of the `YouTubePlayer` component. */
export interface YouTubePlayerProps {
    /** YouTube video id, e.g. `aqz-KE-bpKQ` from `youtube.com/watch?v=aqz-KE-bpKQ`. */
    videoId: string;
    /** Title shown above the video. */
    title?: ReactNode;
    /** Starts playing when ready. Browsers allow it only muted or after a user gesture. @default false */
    autoPlay?: boolean;
    /** Starts muted. @default false */
    defaultMuted?: boolean;
    /** Starts at this position in seconds. @default 0 */
    start?: number;
    /**
     * Loads the player from `youtube-nocookie.com` (privacy-enhanced mode: no cookies until the
     * video plays).
     * @default true
     */
    privacyEnhanced?: boolean;
    /** Size of the controls. @default 'md' */
    size?: MediaControlsSize;
    /** Called when the video ends. */
    onEnded?: () => void;
    /** Called with the YouTube error code (2 invalid id, 5 player error, 100 not found, 101/150 embedding not allowed). */
    onError?: (code: number) => void;
    /** Additional class names for the root element. */
    className?: string;
}

/** Player states of the YouTube IFrame API (`YT.PlayerState`). */
export type YTPlayerState = -1 | 0 | 1 | 2 | 3 | 5;

/** The subset of the YouTube IFrame API player used by `YouTubePlayer`. */
export interface YTPlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    setVolume: (volume: number) => void;
    getVolume: () => number;
    mute: () => void;
    unMute: () => void;
    isMuted: () => boolean;
    getCurrentTime: () => number;
    getDuration: () => number;
    getPlayerState: () => YTPlayerState;
    getIframe: () => HTMLIFrameElement;
    destroy: () => void;
}

/** Options passed to `new YT.Player(...)`. */
export interface YTPlayerOptions {
    videoId: string;
    host?: string;
    width?: string | number;
    height?: string | number;
    playerVars?: Record<string, string | number>;
    events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: YTPlayerState; target: YTPlayer }) => void;
        onError?: (e: { data: number; target: YTPlayer }) => void;
    };
}

/** The global `YT` namespace the IFrame API script installs. */
export interface YTNamespace {
    Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
}

/** `window` with the globals of the IFrame API. */
export interface YTWindow {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
}

/** Playback state mirrored from the YouTube player. */
export interface YouTubeState {
    ready: boolean;
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    errorCode: number | null;
}
