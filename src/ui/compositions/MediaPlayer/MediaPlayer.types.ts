import type { ReactNode } from 'react';
import type { MediaControlsSize } from '../MediaControls/MediaControls.types';

export type MediaKind = 'video' | 'audio';

/** Imperative control of a player, e.g. for voice commands ("pause", "skip 30 seconds"). */
export interface MediaHandle {
    /** Starts playback; resolves when it started (browsers may block autoplay with sound). */
    play: () => Promise<void>;
    /** Pauses playback. */
    pause: () => void;
    /** Jumps to `time` seconds. */
    seek: (time: number) => void;
    /** Sets the volume from 0 to 1. */
    setVolume: (volume: number) => void;
    /** Mutes or unmutes. */
    setMuted: (muted: boolean) => void;
}

/** A captions track for a video, in WebVTT format. */
export interface MediaCaptions {
    /** URL of the `.vtt` file. */
    src: string;
    /** Language of the captions, e.g. `en`. */
    srcLang: string;
    /** Name shown in the browser's captions menu, e.g. `English`. */
    label: string;
}

/** Props of the `MediaPlayer` component. */
export interface MediaPlayerProps {
    /** URL of the video or audio file. */
    src: string;
    /** `video` shows the picture in a 16:9 frame; `audio` shows a compact player. @default 'video' */
    kind?: MediaKind;
    /** Title shown in the player, e.g. the track or clip name. */
    title?: ReactNode;
    /** Image shown before a video starts. */
    poster?: string;
    /** Captions for a video; strongly recommended for spoken content. */
    captions?: MediaCaptions;
    /** Starts playing on mount. Browsers allow it only muted or after a user gesture. @default false */
    autoPlay?: boolean;
    /** Starts again at the end. @default false */
    loop?: boolean;
    /** Initial volume from 0 to 1. @default 1 */
    defaultVolume?: number;
    /** Starts muted. @default false */
    defaultMuted?: boolean;
    /** Size of the controls. @default 'md' */
    size?: MediaControlsSize;
    /** Called when playback reaches the end (not with `loop`). */
    onEnded?: () => void;
    /** Called when the media cannot be loaded or played. */
    onError?: () => void;
    /** Additional class names for the root element. */
    className?: string;
}

/** Playback state mirrored from the media element's events. */
export interface MediaState {
    playing: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    muted: boolean;
    loading: boolean;
    error: boolean;
}
