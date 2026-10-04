import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
    Maximize2,
    Pause,
    Play,
    SkipBack,
    SkipForward,
    Volume1,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { cx } from '@common/utils/cx';
import { IconButton } from '../../primitives/IconButton';
import { Slider } from '../../primitives/Slider';
import { SEEK_STEP_SECONDS } from './constants';
import { formatClock, isFiniteDuration } from './utils';
import type { MediaControlsProps } from './MediaControls.types';

/**
 * Transport controls for any media source: play/pause, seek bar, time, mute and volume, plus
 * optional previous/next and fullscreen. Fully controlled — it only reports what the user does,
 * so it drives a `<video>`, an `<audio>`, a YouTube player or a remote device alike.
 */
export function MediaControls({
    playing,
    currentTime,
    duration,
    volume = 1,
    muted = false,
    onPlayPause,
    onSeek,
    onVolumeChange,
    onMutedChange,
    onPrevious,
    onNext,
    onFullscreen,
    title,
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel = 'Media controls',
    className,
}: MediaControlsProps): ReactElement {
    // While the seek bar is dragged, show the drag position instead of the playing time.
    const [scrub, setScrub] = useState<number | null>(null);
    const seekable = isFiniteDuration(duration) && onSeek !== undefined && !disabled;
    const shownTime = scrub ?? currentTime;
    const rootRef = useRef<HTMLDivElement>(null);

    // Keyboard shortcuts while focus is inside the controls. Native listener: the root is a
    // `group`, not an interactive element. Keys a focused control already handled are skipped.
    const latest = useRef({ playing, currentTime, duration, muted, seekable, disabled });
    const handlers = useRef({ onPlayPause, onSeek, onMutedChange });
    useLayoutEffect(() => {
        latest.current = { playing, currentTime, duration, muted, seekable, disabled };
        handlers.current = { onPlayPause, onSeek, onMutedChange };
    });

    useEffect(() => {
        const el = rootRef.current;
        if (el === null) return;
        const onKeyDown = (e: KeyboardEvent): void => {
            const state = latest.current;
            if (e.defaultPrevented || state.disabled || e.ctrlKey || e.metaKey || e.altKey) return;
            const key = e.key.toLowerCase();
            if (key === 'k') {
                e.preventDefault();
                handlers.current.onPlayPause();
            } else if (key === 'm' && handlers.current.onMutedChange !== undefined) {
                e.preventDefault();
                handlers.current.onMutedChange(!state.muted);
            } else if ((key === 'arrowleft' || key === 'arrowright') && state.seekable) {
                e.preventDefault();
                const delta = key === 'arrowleft' ? -SEEK_STEP_SECONDS : SEEK_STEP_SECONDS;
                const next = Math.min(state.duration, Math.max(0, state.currentTime + delta));
                handlers.current.onSeek?.(next);
            }
        };
        el.addEventListener('keydown', onKeyDown);
        return () => el.removeEventListener('keydown', onKeyDown);
    }, []);

    const buttonSize = size === 'sm' ? 'sm' : 'md';
    const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

    return (
        <div
            ref={rootRef}
            role="group"
            aria-label={ariaLabel}
            className={cx(
                'flex flex-col gap-[6px] w-full font-mono',
                size === 'sm' ? 'text-[9px]' : 'text-[10px]',
                className,
            )}
        >
            {title !== undefined && (
                <div className="truncate uppercase tracking-[1px] text-text">{title}</div>
            )}
            <div className="flex items-center gap-[8px]">
                {onPrevious !== undefined && (
                    <IconButton
                        icon={SkipBack}
                        label="Previous"
                        size={buttonSize}
                        disabled={disabled}
                        onClick={onPrevious}
                    />
                )}
                <IconButton
                    icon={playing ? Pause : Play}
                    label={playing ? 'Pause' : 'Play'}
                    variant="secondary"
                    size={buttonSize}
                    disabled={disabled}
                    onClick={onPlayPause}
                />
                {onNext !== undefined && (
                    <IconButton
                        icon={SkipForward}
                        label="Next"
                        size={buttonSize}
                        disabled={disabled}
                        onClick={onNext}
                    />
                )}
                <span className="shrink-0 tabular-nums text-accent">{formatClock(shownTime)}</span>
                <div className="flex-1 min-w-[60px]">
                    <Slider
                        aria-label="Seek"
                        size={size}
                        fullWidth
                        min={0}
                        max={seekable ? duration : 1}
                        step={1}
                        value={seekable ? Math.min(shownTime, duration) : 0}
                        formatValue={formatClock}
                        disabled={!seekable}
                        onValueChange={setScrub}
                        onValueCommit={(time) => {
                            setScrub(null);
                            onSeek?.(time);
                        }}
                    />
                </div>
                <span className="shrink-0 tabular-nums text-text-secondary">
                    {isFiniteDuration(duration) ? formatClock(duration) : 'LIVE'}
                </span>
                {onMutedChange !== undefined && (
                    <IconButton
                        icon={VolumeIcon}
                        label={muted ? 'Unmute' : 'Mute'}
                        pressed={muted}
                        size={buttonSize}
                        disabled={disabled}
                        onClick={() => onMutedChange(!muted)}
                    />
                )}
                {onVolumeChange !== undefined && (
                    <div className={size === 'sm' ? 'w-[56px] shrink-0' : 'w-[72px] shrink-0'}>
                        <Slider
                            aria-label="Volume"
                            size={size}
                            fullWidth
                            min={0}
                            max={1}
                            step={0.05}
                            value={muted ? 0 : volume}
                            formatValue={(v) => `${Math.round(v * 100)} %`}
                            disabled={disabled}
                            onValueChange={onVolumeChange}
                        />
                    </div>
                )}
                {onFullscreen !== undefined && (
                    <IconButton
                        icon={Maximize2}
                        label="Fullscreen"
                        size={buttonSize}
                        disabled={disabled}
                        onClick={onFullscreen}
                    />
                )}
            </div>
        </div>
    );
}

export default MediaControls;
