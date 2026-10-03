import type { ReactElement } from 'react';
import { SfxProvider, useAudioEngine } from '@core/audio';
import { DocsSfxContext } from './docsSfxContext';
import type { DocsSfxRootProps } from './DocsSfxRoot.types';

/**
 * Mounts the audio engine for the docs site. Sounds are served from the site's `public/sounds/`,
 * which lives under the GitHub Pages base path, so the base URL is derived from BASE_URL.
 */
export function DocsSfxRoot({ children }: DocsSfxRootProps): ReactElement {
    const { isMuted, toggleMute, playOneShot, play, stop } = useAudioEngine('idle', true, false, {
        soundBaseUrl: `${import.meta.env.BASE_URL}sounds/`,
    });

    return (
        <DocsSfxContext.Provider value={{ isMuted, toggleMute }}>
            <SfxProvider playOneShot={playOneShot} play={play} stop={stop}>
                {children}
            </SfxProvider>
        </DocsSfxContext.Provider>
    );
}

export default DocsSfxRoot;
