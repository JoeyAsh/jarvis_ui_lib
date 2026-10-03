import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { JarvisProvider } from '../JarvisProvider';
import { useJarvis } from '../jarvisContext';
import { useToast } from '../../ToastProvider';
import { AudioEngine, useAudioEngine, useSfx } from '@core/audio';

vi.mock('@core/audio/useAudioEngine', () => ({ useAudioEngine: vi.fn() }));
// Stub engine class: the real constructor creates an AudioContext, which jsdom lacks.
vi.mock('@core/audio/audioEngine', () => ({
    AudioEngine: class {},
    getAudioEngine: vi.fn(),
    __resetAudioEngineSingleton: vi.fn(),
}));

const engineState = {
    isMuted: false,
    toggleMute: vi.fn(),
    playOneShot: vi.fn(),
    play: vi.fn(),
    stop: vi.fn(),
};

beforeEach(() => {
    engineState.isMuted = false;
    vi.mocked(useAudioEngine).mockImplementation(() => ({
        ...engineState,
        engine: new AudioEngine(),
    }));
});

afterEach(() => {
    vi.clearAllMocks();
});

function Controls() {
    const { isMuted, toggleMute } = useJarvis();
    const { toast } = useToast();
    const { playOneShot } = useSfx();
    return (
        <>
            <span>muted:{String(isMuted)}</span>
            <button type="button" onClick={toggleMute}>
                mute
            </button>
            <button type="button" onClick={() => toast({ title: 'Hello' })}>
                toast
            </button>
            <button type="button" onClick={() => playOneShot('click')}>
                sound
            </button>
        </>
    );
}

describe('JarvisProvider', () => {
    it('starts the audio engine with defaults and sound enabled', () => {
        render(
            <JarvisProvider>
                <Controls />
            </JarvisProvider>,
        );
        expect(useAudioEngine).toHaveBeenCalledWith('idle', true, false, {
            soundBaseUrl: undefined,
            initialMuted: false,
        });
    });

    it('sfx={false} starts muted and forwards engine options', () => {
        render(
            <JarvisProvider sfx={false} soundBaseUrl="/sfx/" orbState="thinking" connected={false}>
                <Controls />
            </JarvisProvider>,
        );
        expect(useAudioEngine).toHaveBeenCalledWith('thinking', false, false, {
            soundBaseUrl: '/sfx/',
            initialMuted: true,
        });
    });

    it('useJarvis exposes mute state and toggle', () => {
        engineState.isMuted = true;
        render(
            <JarvisProvider>
                <Controls />
            </JarvisProvider>,
        );
        expect(screen.getByText('muted:true')).toBeDefined();
        fireEvent.click(screen.getByRole('button', { name: 'mute' }));
        expect(engineState.toggleMute).toHaveBeenCalledTimes(1);
    });

    it('provides SFX to descendants', () => {
        render(
            <JarvisProvider>
                <Controls />
            </JarvisProvider>,
        );
        fireEvent.click(screen.getByRole('button', { name: 'sound' }));
        expect(engineState.playOneShot).toHaveBeenCalledWith('click');
    });

    it('provides toasts', () => {
        render(
            <JarvisProvider toastPlacement="top-right">
                <Controls />
            </JarvisProvider>,
        );
        act(() => {
            fireEvent.click(screen.getByRole('button', { name: 'toast' }));
        });
        expect(screen.getByRole('status').textContent).toContain('Hello');
        expect(screen.getByRole('region', { name: 'Notifications' }).className).toContain('top-4');
    });

    it('useJarvis throws outside the provider', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        function Orphan() {
            useJarvis();
            return null;
        }
        expect(() => render(<Orphan />)).toThrow(/JarvisProvider/);
    });
});
