import type { ReactNode } from 'react';

export type MediaControlsSize = 'sm' | 'md';

/** Props of the `MediaControls` component. */
export interface MediaControlsProps {
    /** Whether the media is playing; switches the play/pause button. */
    playing: boolean;
    /** Playback position in seconds. */
    currentTime: number;
    /**
     * Length in seconds. `0`, `NaN` or `Infinity` (unknown or live) disables the seek bar and
     * shows `LIVE` instead of the total time.
     */
    duration: number;
    /** Volume from 0 to 1. @default 1 */
    volume?: number;
    /** Whether the sound is muted; switches the mute button. @default false */
    muted?: boolean;
    /** Called when the play/pause button is pressed (or `K` while the controls have focus). */
    onPlayPause: () => void;
    /**
     * Called with the target time in seconds when the user seeks: at the end of a drag on the seek
     * bar, on its arrow keys, or with ←/→ (±5 s) while the controls have focus.
     */
    onSeek?: (time: number) => void;
    /** Called with the new volume (0–1) while the volume slider moves. Hides the slider if omitted. */
    onVolumeChange?: (volume: number) => void;
    /** Called with the new muted state (mute button or `M`). Hides the mute button if omitted. */
    onMutedChange?: (muted: boolean) => void;
    /** Shows a previous-track button. */
    onPrevious?: () => void;
    /** Shows a next-track button. */
    onNext?: () => void;
    /** Shows a fullscreen button. */
    onFullscreen?: () => void;
    /** Title shown above the controls, e.g. the track name. */
    title?: ReactNode;
    /** Button and text size. @default 'md' */
    size?: MediaControlsSize;
    /** Disables all controls, e.g. while the media is loading. @default false */
    disabled?: boolean;
    /** Accessible name of the controls group. @default 'Media controls' */
    'aria-label'?: string;
    /** Additional class names for the root `role="group"` element. */
    className?: string;
}
