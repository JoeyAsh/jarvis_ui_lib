import { createContext, useContext } from 'react';
import type { JarvisContextValue } from './JarvisProvider.types';

export const JarvisContext = createContext<JarvisContextValue | null>(null);

/**
 * App-level controls provided by `JarvisProvider`, e.g. the sound mute toggle.
 *
 * @example
 * const { isMuted, toggleMute } = useJarvis();
 */
export function useJarvis(): JarvisContextValue {
    const value = useContext(JarvisContext);
    if (value === null) {
        throw new Error('useJarvis() must be used inside <JarvisProvider>.');
    }
    return value;
}
