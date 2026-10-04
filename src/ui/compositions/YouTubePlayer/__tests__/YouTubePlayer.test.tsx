import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createRef } from 'react';
import { YouTubePlayer } from '../YouTubePlayer';
import { loadYouTubeApi, resetYouTubeApiForTests, watchUrl } from '../utils';
import type { MediaHandle } from '../../MediaPlayer/MediaPlayer.types';
import type { YTPlayer, YTPlayerOptions, YTPlayerState, YTWindow } from '../YouTubePlayer.types';

/** A fake `YT.Player` that records calls; tests drive its events. */
class FakePlayer implements YTPlayer {
    static last: FakePlayer | null = null;
    options: YTPlayerOptions;
    state: YTPlayerState = -1;
    time = 0;
    volume = 100;
    muted = false;
    playVideo = vi.fn(() => this.emitState(1));
    pauseVideo = vi.fn(() => this.emitState(2));
    seekTo = vi.fn((s: number) => {
        this.time = s;
    });
    setVolume = vi.fn((v: number) => {
        this.volume = v;
    });
    mute = vi.fn(() => {
        this.muted = true;
    });
    unMute = vi.fn(() => {
        this.muted = false;
    });
    destroy = vi.fn();

    constructor(_el: HTMLElement, options: YTPlayerOptions) {
        this.options = options;
        FakePlayer.last = this;
    }

    getVolume = (): number => this.volume;
    isMuted = (): boolean => this.muted;
    getCurrentTime = (): number => this.time;
    getDuration = (): number => 296;
    getPlayerState = (): YTPlayerState => this.state;
    getIframe = (): HTMLIFrameElement => document.createElement('iframe');

    ready(): void {
        act(() => this.options.events?.onReady?.({ target: this }));
    }

    emitState(data: YTPlayerState): void {
        this.state = data;
        this.options.events?.onStateChange?.({ data, target: this });
    }

    emitError(code: number): void {
        act(() => this.options.events?.onError?.({ data: code, target: this }));
    }
}

const ytWindow = (): Window & YTWindow => window;

async function flush(): Promise<void> {
    await act(async () => {
        await Promise.resolve();
    });
}

function player(): FakePlayer {
    if (FakePlayer.last === null) throw new Error('player not created');
    return FakePlayer.last;
}

beforeEach(() => {
    FakePlayer.last = null;
    resetYouTubeApiForTests();
    ytWindow().YT = { Player: FakePlayer };
});

afterEach(() => {
    delete ytWindow().YT;
    delete ytWindow().onYouTubeIframeAPIReady;
    document.head.querySelectorAll('script[src*="youtube"]').forEach((s) => s.remove());
    vi.restoreAllMocks();
});

describe('YouTubePlayer utils', () => {
    it('reuses an existing window.YT without loading a script', async () => {
        await expect(loadYouTubeApi()).resolves.toBe(ytWindow().YT);
        expect(document.head.querySelector('script[src*="youtube"]')).toBeNull();
    });

    it('injects the API script once and resolves on onYouTubeIframeAPIReady', async () => {
        delete ytWindow().YT;
        const a = loadYouTubeApi();
        const b = loadYouTubeApi();
        expect(a).toBe(b);
        expect(document.head.querySelectorAll('script[src*="youtube"]')).toHaveLength(1);
        ytWindow().YT = { Player: FakePlayer };
        ytWindow().onYouTubeIframeAPIReady?.();
        await expect(a).resolves.toBe(ytWindow().YT);
    });

    it('builds the watch URL', () => {
        expect(watchUrl('abc')).toBe('https://www.youtube.com/watch?v=abc');
    });
});

describe('YouTubePlayer', () => {
    it('creates a privacy-enhanced player without YouTube controls', async () => {
        render(<YouTubePlayer videoId="abc" title="Clip" start={10} />);
        await flush();
        const opts = player().options;
        expect(opts.videoId).toBe('abc');
        expect(opts.host).toBe('https://www.youtube-nocookie.com');
        expect(opts.playerVars?.controls).toBe(0);
        expect(opts.playerVars?.start).toBe(10);
        expect(screen.getByText('Clip')).toBeDefined();
    });

    it('disables the controls until the player is ready', async () => {
        render(<YouTubePlayer videoId="abc" />);
        await flush();
        expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Play' }).disabled).toBe(true);
        player().ready();
        expect(screen.getByText('4:56')).toBeDefined();
        const buttons = screen.getAllByRole<HTMLButtonElement>('button', { name: 'Play' });
        expect(buttons.every((b) => !b.disabled)).toBe(true);
    });

    it('plays, pauses and seeks through the controls', async () => {
        render(<YouTubePlayer videoId="abc" />);
        await flush();
        player().ready();
        act(() => {
            fireEvent.click(screen.getAllByRole('button', { name: 'Play' })[0]);
        });
        expect(player().playVideo).toHaveBeenCalled();
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
        });
        expect(player().pauseVideo).toHaveBeenCalled();
        fireEvent.keyDown(screen.getByRole('slider', { name: 'Seek' }), { key: 'End' });
        expect(player().seekTo).toHaveBeenCalledWith(296, true);
    });

    it('exposes the MediaHandle through the ref', async () => {
        const ref = createRef<MediaHandle>();
        render(<YouTubePlayer ref={ref} videoId="abc" />);
        await flush();
        player().ready();
        act(() => {
            ref.current?.setVolume(0.3);
            ref.current?.setMuted(true);
            ref.current?.seek(30);
        });
        expect(player().setVolume).toHaveBeenCalledWith(30);
        expect(player().mute).toHaveBeenCalled();
        expect(player().seekTo).toHaveBeenCalledWith(30, true);
    });

    it('shows a link to YouTube when embedding is not allowed', async () => {
        const onError = vi.fn();
        render(<YouTubePlayer videoId="abc" onError={onError} />);
        await flush();
        player().emitError(150);
        expect(onError).toHaveBeenCalledWith(150);
        expect(screen.getByRole('alert').textContent).toContain('Embedding is disabled');
        expect(screen.getByRole('link', { name: /Watch on YouTube/ }).getAttribute('href')).toBe(
            'https://www.youtube.com/watch?v=abc',
        );
    });

    it('destroys the player on unmount', async () => {
        const { unmount } = render(<YouTubePlayer videoId="abc" />);
        await flush();
        const p = player();
        unmount();
        expect(p.destroy).toHaveBeenCalled();
    });
});
