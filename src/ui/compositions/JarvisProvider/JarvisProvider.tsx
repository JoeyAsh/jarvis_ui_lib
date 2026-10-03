import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { SfxProvider, useAudioEngine } from '@core/audio';
import { ToastProvider } from '../ToastProvider';
import { JarvisContext } from './jarvisContext';
import type { JarvisContextValue, JarvisProviderProps } from './JarvisProvider.types';

/**
 * Root provider for a JARVIS app: mounts the audio engine (UI sounds), the toast system and the
 * `useJarvis()` controls. Wrap your app in it once.
 */
export function JarvisProvider({
    children,
    sfx = true,
    soundBaseUrl,
    orbState = 'idle',
    connected = true,
    heartbeat = false,
    toastPlacement,
    toastMax,
    toastDuration,
}: JarvisProviderProps): ReactElement {
    const { isMuted, toggleMute, playOneShot, play, stop } = useAudioEngine(
        orbState,
        connected,
        heartbeat,
        { soundBaseUrl, initialMuted: !sfx },
    );

    const value = useMemo<JarvisContextValue>(
        () => ({ isMuted, toggleMute }),
        [isMuted, toggleMute],
    );

    return (
        <JarvisContext.Provider value={value}>
            <SfxProvider playOneShot={playOneShot} play={play} stop={stop}>
                <ToastProvider placement={toastPlacement} max={toastMax} duration={toastDuration}>
                    {children}
                </ToastProvider>
            </SfxProvider>
        </JarvisContext.Provider>
    );
}

export default JarvisProvider;
