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
import { Link } from '../../primitives/Link';
import type { MediaHandle } from '../MediaPlayer/MediaPlayer.types';
import { YT_EMBED_BLOCKED, YT_NOCOOKIE_HOST, YT_POLL_MS, YT_STATE } from './constants';
import { loadYouTubeApi, watchUrl } from './utils';
import type { YouTubePlayerProps, YouTubeState, YTPlayer } from './YouTubePlayer.types';

/**
 * Plays a YouTube video through the YouTube IFrame Player API, with HUD `MediaControls` instead of
 * YouTube's own. The API script is loaded on first mount. The ref exposes the same `MediaHandle`
 * as `MediaPlayer` (`play`, `pause`, `seek`, `setVolume`, `setMuted`).
 */
export const YouTubePlayer = forwardRef<MediaHandle, YouTubePlayerProps>(function YouTubePlayer(
    {
        videoId,
        title,
        autoPlay = false,
        defaultMuted = false,
        start = 0,
        privacyEnhanced = true,
        size = 'md',
        onEnded,
        onError,
        className,
    },
    ref,
) {
    const frameRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const [state, setState] = useState<YouTubeState>({
        ready: false,
        playing: false,
        currentTime: start,
        duration: 0,
        volume: 1,
        muted: defaultMuted,
        errorCode: null,
    });

    // Options that only apply when a player is created, and the latest callbacks.
    const options = useRef({ autoPlay, defaultMuted, start, onEnded, onError });
    useLayoutEffect(() => {
        options.current = { autoPlay, defaultMuted, start, onEnded, onError };
    });

    // Create a player per video. The API replaces the element it gets with an iframe, so it gets
    // a node React does not manage.
    useEffect(() => {
        const frame = frameRef.current;
        if (frame === null) return;
        const mount = document.createElement('div');
        frame.appendChild(mount);
        let cancelled = false;
        let player: YTPlayer | null = null;
        const opts = options.current;
        setState((s) => ({ ...s, ready: false, playing: false, errorCode: null }));

        loadYouTubeApi()
            .then((YT) => {
                if (cancelled) return;
                player = new YT.Player(mount, {
                    videoId,
                    host: privacyEnhanced ? YT_NOCOOKIE_HOST : undefined,
                    width: '100%',
                    height: '100%',
                    playerVars: {
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        autoplay: opts.autoPlay ? 1 : 0,
                        mute: opts.defaultMuted ? 1 : 0,
                        start: Math.floor(opts.start),
                    },
                    events: {
                        onReady: (e) => {
                            playerRef.current = e.target;
                            setState((s) => ({
                                ...s,
                                ready: true,
                                duration: e.target.getDuration(),
                                volume: e.target.getVolume() / 100,
                                muted: e.target.isMuted(),
                            }));
                        },
                        onStateChange: (e) => {
                            setState((s) => ({
                                ...s,
                                playing: e.data === YT_STATE.playing,
                                duration: e.target.getDuration(),
                                currentTime: e.target.getCurrentTime(),
                            }));
                            if (e.data === YT_STATE.ended) options.current.onEnded?.();
                        },
                        onError: (e) => {
                            setState((s) => ({ ...s, playing: false, errorCode: e.data }));
                            options.current.onError?.(e.data);
                        },
                    },
                });
            })
            .catch(() => {
                if (!cancelled) setState((s) => ({ ...s, errorCode: -1 }));
            });

        return () => {
            cancelled = true;
            playerRef.current = null;
            player?.destroy();
            mount.remove();
        };
    }, [videoId, privacyEnhanced]);

    // The IFrame API has no time event: poll while playing.
    useEffect(() => {
        if (!state.playing) return;
        const timer = window.setInterval(() => {
            const player = playerRef.current;
            if (player !== null) {
                setState((s) => ({ ...s, currentTime: player.getCurrentTime() }));
            }
        }, YT_POLL_MS);
        return () => window.clearInterval(timer);
    }, [state.playing]);

    const api: MediaHandle = {
        play: () => {
            playerRef.current?.playVideo();
            return Promise.resolve();
        },
        pause: () => playerRef.current?.pauseVideo(),
        seek: (time) => {
            const t = Math.max(0, time);
            playerRef.current?.seekTo(t, true);
            setState((s) => ({ ...s, currentTime: t }));
        },
        setVolume: (volume) => {
            const v = Math.min(1, Math.max(0, volume));
            const player = playerRef.current;
            if (player === null) return;
            player.setVolume(Math.round(v * 100));
            if (v > 0) player.unMute();
            setState((s) => ({ ...s, volume: v, muted: v > 0 ? false : s.muted }));
        },
        setMuted: (muted) => {
            const player = playerRef.current;
            if (player === null) return;
            if (muted) player.mute();
            else player.unMute();
            setState((s) => ({ ...s, muted }));
        },
    };
    useImperativeHandle(ref, () => api);

    function togglePlay(): void {
        if (state.playing) api.pause();
        else void api.play();
    }

    const onBigPlay = useClickSfx(togglePlay);

    const blocked =
        state.errorCode !== null &&
        (YT_EMBED_BLOCKED as readonly number[]).includes(state.errorCode);
    const failed = state.errorCode !== null;
    const message =
        state.errorCode === -1
            ? 'YouTube could not be loaded'
            : blocked
              ? 'Embedding is disabled for this video'
              : 'Video unavailable';
    const showBigPlay = state.ready && !state.playing && !failed && state.currentTime <= start;

    return (
        <div className={cx('flex flex-col gap-[8px] w-full font-mono', className)}>
            {title !== undefined && (
                <div className="truncate text-[10px] uppercase tracking-[1px] text-text">
                    {title}
                </div>
            )}
            <div className="relative w-full aspect-video overflow-hidden border border-border rounded-[2px] bg-bg">
                <div
                    ref={frameRef}
                    className="absolute inset-0 [&_iframe]:block [&_iframe]:w-full [&_iframe]:h-full"
                />
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
                {failed && (
                    <div
                        role="alert"
                        className="absolute inset-0 flex flex-col items-center justify-center gap-[10px] bg-[rgba(5,5,8,0.88)]"
                    >
                        <span className="inline-flex items-center gap-[6px] text-[10px] uppercase tracking-[1px] text-error">
                            <TriangleAlert size={12} aria-hidden="true" />
                            {message}
                        </span>
                        {state.errorCode !== -1 && (
                            <Link href={watchUrl(videoId)} external>
                                Watch on YouTube
                            </Link>
                        )}
                    </div>
                )}
            </div>
            <MediaControls
                size={size}
                playing={state.playing}
                currentTime={state.currentTime}
                duration={state.duration}
                volume={state.volume}
                muted={state.muted}
                disabled={!state.ready || failed}
                onPlayPause={togglePlay}
                onSeek={api.seek}
                onVolumeChange={api.setVolume}
                onMutedChange={api.setMuted}
            />
        </div>
    );
});

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
