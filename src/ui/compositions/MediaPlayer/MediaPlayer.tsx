import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { Play, TriangleAlert } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useClickSfx } from '@core/audio';
import { MediaControls } from '../MediaControls';
import { WaveStrip } from '../../primitives/WaveStrip';
import { durationOf, readMediaState } from './utils';
import type { MediaHandle, MediaPlayerProps, MediaState } from './MediaPlayer.types';

/**
 * A video or audio player: the native media element with HUD `MediaControls`. The ref exposes
 * `play`, `pause`, `seek`, `setVolume` and `setMuted` for programmatic control.
 */
export const MediaPlayer = forwardRef<MediaHandle, MediaPlayerProps>(function MediaPlayer(
    {
        src,
        kind = 'video',
        title,
        poster,
        captions,
        autoPlay = false,
        loop = false,
        defaultVolume = 1,
        defaultMuted = false,
        size = 'md',
        onEnded,
        onError,
        className,
    },
    ref,
) {
    const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    // Like other `default*` props, the initial volume and mute state apply once.
    const [initial] = useState({ volume: defaultVolume, muted: defaultMuted });
    const [state, setState] = useState<MediaState>({
        playing: false,
        currentTime: 0,
        duration: 0,
        volume: defaultVolume,
        muted: defaultMuted,
        loading: true,
        error: false,
    });

    const callbacks = useRef({ onEnded, onError });
    useLayoutEffect(() => {
        callbacks.current = { onEnded, onError };
    });

    const api: MediaHandle = {
        play: async () => {
            await mediaRef.current?.play();
        },
        pause: () => mediaRef.current?.pause(),
        seek: (time) => {
            if (mediaRef.current !== null) mediaRef.current.currentTime = Math.max(0, time);
        },
        setVolume: (volume) => {
            if (mediaRef.current !== null) {
                mediaRef.current.volume = Math.min(1, Math.max(0, volume));
                if (volume > 0) mediaRef.current.muted = false;
            }
        },
        setMuted: (muted) => {
            if (mediaRef.current !== null) mediaRef.current.muted = muted;
        },
    };
    useImperativeHandle(ref, () => api);

    // Mirror the element's state from its events. React's `muted` attribute is not reliable, so
    // the initial volume and mute state are applied to the element here.
    useEffect(() => {
        const el = mediaRef.current;
        if (el === null) return;
        el.volume = initial.volume;
        el.muted = initial.muted;
        const sync = (patch: Partial<MediaState>): void => setState((s) => ({ ...s, ...patch }));
        const listeners: [string, () => void][] = [
            ['play', () => sync({ playing: true })],
            ['pause', () => sync({ playing: false })],
            [
                'ended',
                () => {
                    sync({ playing: false });
                    callbacks.current.onEnded?.();
                },
            ],
            ['timeupdate', () => sync({ currentTime: el.currentTime, duration: durationOf(el) })],
            ['durationchange', () => sync({ duration: durationOf(el) })],
            ['loadedmetadata', () => sync({ duration: durationOf(el), loading: false })],
            ['volumechange', () => sync({ volume: el.volume, muted: el.muted })],
            ['waiting', () => sync({ loading: true })],
            ['canplay', () => sync({ duration: durationOf(el), loading: false, error: false })],
            [
                'error',
                () => {
                    sync({ error: true, loading: false, playing: false });
                    callbacks.current.onError?.();
                },
            ],
        ];
        for (const [event, handler] of listeners) el.addEventListener(event, handler);
        // Events that fired before the listeners attached (e.g. metadata from cache) are missed:
        // start from what the element already knows.
        sync(readMediaState(el));
        return () => {
            for (const [event, handler] of listeners) el.removeEventListener(event, handler);
        };
    }, [initial]);

    function togglePlay(): void {
        const el = mediaRef.current;
        if (el === null) return;
        // Follow the shown state, so the button always does what its icon says.
        if (state.playing) {
            el.pause();
        } else {
            el.play().catch(() => setState((s) => ({ ...s, playing: false })));
        }
    }

    const onBigPlay = useClickSfx(togglePlay);

    const controls = (
        <MediaControls
            title={kind === 'audio' ? title : undefined}
            size={size}
            playing={state.playing}
            currentTime={state.currentTime}
            duration={state.duration}
            volume={state.volume}
            muted={state.muted}
            disabled={state.error}
            onPlayPause={togglePlay}
            onSeek={api.seek}
            onVolumeChange={api.setVolume}
            onMutedChange={api.setMuted}
            onFullscreen={
                kind === 'video'
                    ? () => {
                          rootRef.current?.requestFullscreen().catch(() => undefined);
                      }
                    : undefined
            }
        />
    );

    const errorNote = state.error && (
        <span className="inline-flex items-center gap-[6px] text-[10px] uppercase tracking-[1px] text-error">
            <TriangleAlert size={12} aria-hidden="true" />
            Media unavailable
        </span>
    );

    if (kind === 'audio') {
        return (
            <div
                ref={rootRef}
                className={cx(
                    'flex items-center gap-[12px] w-full p-[10px] font-mono',
                    'border border-border rounded-[2px] bg-[rgba(13,13,20,0.75)]',
                    className,
                )}
            >
                <audio ref={mediaRef} src={src} autoPlay={autoPlay} loop={loop} preload="metadata">
                    <track
                        kind="captions"
                        src={captions?.src}
                        srcLang={captions?.srcLang}
                        label={captions?.label}
                    />
                </audio>
                <WaveStrip active={state.playing} />
                <div className="flex flex-1 min-w-0 flex-col gap-[4px]">
                    {controls}
                    {errorNote}
                </div>
            </div>
        );
    }

    const showBigPlay = !state.playing && state.currentTime === 0 && !state.error;

    return (
        <div
            ref={rootRef}
            className={cx('flex flex-col gap-[8px] w-full font-mono bg-bg', className)}
        >
            {title !== undefined && (
                <div className="truncate text-[10px] uppercase tracking-[1px] text-text">
                    {title}
                </div>
            )}
            <div className="relative w-full aspect-video overflow-hidden border border-border rounded-[2px] bg-bg">
                <video
                    ref={mediaRef}
                    src={src}
                    poster={poster}
                    autoPlay={autoPlay}
                    loop={loop}
                    playsInline
                    preload="metadata"
                    className="block w-full h-full object-contain"
                >
                    <track
                        kind="captions"
                        src={captions?.src}
                        srcLang={captions?.srcLang}
                        label={captions?.label}
                    />
                </video>
                {showBigPlay && (
                    <button
                        type="button"
                        aria-label="Play"
                        onClick={onBigPlay}
                        data-sfx-hover="button"
                        className={cx(
                            'absolute inset-0 m-auto w-[56px] h-[56px] inline-flex items-center justify-center',
                            'border border-accent rounded-[2px] bg-[rgba(13,13,20,0.72)] text-accent-bright',
                            'shadow-glow cursor-pointer hover:shadow-glow-strong transition-shadow duration-[150ms]',
                            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                        )}
                    >
                        <Play size={22} aria-hidden="true" />
                    </button>
                )}
                {state.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(5,5,8,0.8)]">
                        {errorNote}
                    </div>
                )}
            </div>
            {controls}
        </div>
    );
});

MediaPlayer.displayName = 'MediaPlayer';

export default MediaPlayer;
