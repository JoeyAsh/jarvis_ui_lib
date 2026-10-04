import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createRef } from 'react';
import { MediaPlayer } from '../MediaPlayer';
import type { MediaHandle } from '../MediaPlayer.types';

let playSpy: ReturnType<typeof vi.fn<() => Promise<void>>>;
let pauseSpy: ReturnType<typeof vi.fn<() => void>>;

beforeEach(() => {
    // jsdom has no media playback: stub play/pause and fire the events a browser would.
    playSpy = vi.fn(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event('play'));
        return Promise.resolve();
    });
    pauseSpy = vi.fn(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event('pause'));
    });
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(playSpy);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pauseSpy);
});

afterEach(() => {
    vi.restoreAllMocks();
});

function media(container: HTMLElement): HTMLMediaElement {
    const el = container.querySelector<HTMLMediaElement>('video, audio');
    if (el === null) throw new Error('no media element');
    return el;
}

/** Simulates loaded metadata: jsdom's duration is NaN and read-only. */
function loadMetadata(el: HTMLMediaElement, duration: number): void {
    Object.defineProperty(el, 'duration', { value: duration, configurable: true });
    act(() => {
        el.dispatchEvent(new Event('loadedmetadata'));
    });
}

describe('MediaPlayer', () => {
    it('renders a video with a captions track and HUD controls', () => {
        const { container } = render(
            <MediaPlayer
                src="clip.mp4"
                title="Clip"
                captions={{ src: 'clip.vtt', srcLang: 'en', label: 'English' }}
            />,
        );
        const video = media(container);
        expect(video.tagName).toBe('VIDEO');
        expect(video.getAttribute('src')).toBe('clip.mp4');
        expect(video.querySelector('track')?.getAttribute('src')).toBe('clip.vtt');
        expect(screen.getByText('Clip')).toBeDefined();
        expect(screen.getByRole('group', { name: 'Media controls' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeDefined();
    });

    it('plays from the big play button and from the controls', () => {
        const { container } = render(<MediaPlayer src="clip.mp4" />);
        loadMetadata(media(container), 120);
        const buttons = screen.getAllByRole('button', { name: 'Play' });
        fireEvent.click(buttons[0]);
        expect(playSpy).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Pause' })).toBeDefined();
        fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
        expect(pauseSpy).toHaveBeenCalledTimes(1);
    });

    it('mirrors time and duration from media events', () => {
        const { container } = render(<MediaPlayer src="clip.mp4" />);
        const video = media(container);
        loadMetadata(video, 296);
        video.currentTime = 83;
        act(() => {
            video.dispatchEvent(new Event('timeupdate'));
        });
        expect(screen.getByText('1:23')).toBeDefined();
        expect(screen.getByText('4:56')).toBeDefined();
    });

    it('exposes play, pause, seek, volume and mute through the ref', async () => {
        const ref = createRef<MediaHandle>();
        const { container } = render(<MediaPlayer ref={ref} src="clip.mp4" />);
        const video = media(container);
        await act(async () => {
            await ref.current?.play();
        });
        expect(playSpy).toHaveBeenCalled();
        act(() => {
            ref.current?.seek(42);
            ref.current?.setVolume(0.25);
            ref.current?.setMuted(true);
        });
        expect(video.currentTime).toBe(42);
        expect(video.volume).toBe(0.25);
        expect(video.muted).toBe(true);
    });

    it('applies the initial volume and mute state', () => {
        const { container } = render(
            <MediaPlayer src="clip.mp4" defaultVolume={0.4} defaultMuted />,
        );
        expect(media(container).volume).toBe(0.4);
        expect(media(container).muted).toBe(true);
    });

    it('audio kind renders a compact player with title and wave strip', () => {
        const { container } = render(<MediaPlayer src="song.mp3" kind="audio" title="Song" />);
        expect(media(container).tagName).toBe('AUDIO');
        expect(screen.getByText('Song')).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Fullscreen' })).toBeNull();
    });

    it('shows an error state and calls onError and onEnded', () => {
        const onError = vi.fn();
        const onEnded = vi.fn();
        const { container } = render(
            <MediaPlayer src="missing.mp4" onError={onError} onEnded={onEnded} />,
        );
        const video = media(container);
        act(() => {
            video.dispatchEvent(new Event('ended'));
            video.dispatchEvent(new Event('error'));
        });
        expect(onEnded).toHaveBeenCalled();
        expect(onError).toHaveBeenCalled();
        expect(screen.getAllByText('Media unavailable').length).toBeGreaterThan(0);
    });
});

describe('MediaPlayer — media loaded before mount', () => {
    it('reads the duration the element already knows (metadata from cache)', () => {
        vi.spyOn(HTMLMediaElement.prototype, 'duration', 'get').mockReturnValue(120);
        render(<MediaPlayer src="cached.mp4" />);
        expect(screen.getByText('2:00')).toBeDefined();
        const seek = screen.getByRole('slider', { name: 'Seek' });
        expect(seek.getAttribute('aria-disabled')).toBeNull();
        expect(seek.getAttribute('aria-valuemax')).toBe('120');
    });
});
