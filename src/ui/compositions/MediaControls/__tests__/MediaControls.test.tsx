import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MediaControls } from '../MediaControls';
import type { MediaControlsProps } from '../MediaControls.types';
import { formatClock, isFiniteDuration } from '../utils';

function renderControls(props: Partial<MediaControlsProps> = {}) {
    const handlers = {
        onPlayPause: vi.fn(),
        onSeek: vi.fn(),
        onVolumeChange: vi.fn(),
        onMutedChange: vi.fn(),
    };
    render(
        <MediaControls
            playing={false}
            currentTime={83}
            duration={296}
            volume={0.6}
            {...handlers}
            {...props}
        />,
    );
    return handlers;
}

describe('MediaControls utils', () => {
    it('formats media clocks', () => {
        expect(formatClock(83)).toBe('1:23');
        expect(formatClock(3725)).toBe('1:02:05');
        expect(formatClock(Number.NaN)).toBe('0:00');
    });

    it('detects unknown or live durations', () => {
        expect(isFiniteDuration(10)).toBe(true);
        expect(isFiniteDuration(0)).toBe(false);
        expect(isFiniteDuration(Number.POSITIVE_INFINITY)).toBe(false);
    });
});

describe('MediaControls', () => {
    it('renders a named group with time, seek and volume', () => {
        renderControls();
        expect(screen.getByRole('group', { name: 'Media controls' })).toBeDefined();
        expect(screen.getByText('1:23')).toBeDefined();
        expect(screen.getByText('4:56')).toBeDefined();
        expect(screen.getByRole('slider', { name: 'Seek' }).getAttribute('aria-valuetext')).toBe(
            '1:23',
        );
        expect(screen.getByRole('slider', { name: 'Volume' }).getAttribute('aria-valuenow')).toBe(
            '0.6',
        );
    });

    it('play/pause button reflects and toggles the state', () => {
        const h = renderControls({ playing: true });
        fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
        expect(h.onPlayPause).toHaveBeenCalledTimes(1);
    });

    it('mute button reports the next state', () => {
        const h = renderControls({ muted: true });
        const btn = screen.getByRole('button', { name: 'Unmute' });
        expect(btn.getAttribute('aria-pressed')).toBe('true');
        fireEvent.click(btn);
        expect(h.onMutedChange).toHaveBeenCalledWith(false);
    });

    it('seeks with the seek bar keys', () => {
        const h = renderControls();
        fireEvent.keyDown(screen.getByRole('slider', { name: 'Seek' }), { key: 'ArrowRight' });
        expect(h.onSeek).toHaveBeenCalledWith(84);
    });

    it('keyboard shortcuts: K plays, M mutes, arrows seek ±5 s', () => {
        const h = renderControls();
        const play = screen.getByRole('button', { name: 'Play' });
        fireEvent.keyDown(play, { key: 'k' });
        expect(h.onPlayPause).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(play, { key: 'm' });
        expect(h.onMutedChange).toHaveBeenCalledWith(true);
        fireEvent.keyDown(play, { key: 'ArrowLeft' });
        expect(h.onSeek).toHaveBeenCalledWith(78);
        fireEvent.keyDown(play, { key: 'ArrowRight' });
        expect(h.onSeek).toHaveBeenLastCalledWith(88);
    });

    it('live or unknown duration disables seeking and shows LIVE', () => {
        const h = renderControls({ duration: Number.POSITIVE_INFINITY });
        expect(screen.getByText('LIVE')).toBeDefined();
        const seek = screen.getByRole('slider', { name: 'Seek' });
        expect(seek.getAttribute('aria-disabled')).toBe('true');
        fireEvent.keyDown(screen.getByRole('button', { name: 'Play' }), { key: 'ArrowRight' });
        expect(h.onSeek).not.toHaveBeenCalled();
    });

    it('optional buttons appear only with their handler; title is shown', () => {
        const onNext = vi.fn();
        renderControls({ onNext, onFullscreen: vi.fn(), title: 'Track 01' });
        expect(screen.getByText('Track 01')).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Previous' })).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(onNext).toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeDefined();
    });

    it('hides volume and mute without handlers; disabled disables the buttons', () => {
        render(
            <MediaControls
                playing={false}
                currentTime={0}
                duration={10}
                onPlayPause={vi.fn()}
                disabled
            />,
        );
        expect(screen.queryByRole('slider', { name: 'Volume' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Mute' })).toBeNull();
        expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Play' }).disabled).toBe(true);
    });
});
