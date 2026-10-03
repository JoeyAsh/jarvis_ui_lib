import { createContext, useContext } from 'react';
import type { DocsSfxContextValue } from './DocsSfxRoot.types';

export const DocsSfxContext = createContext<DocsSfxContextValue>({
    isMuted: false,
    toggleMute: () => undefined,
});

/** Mute state and toggle of the docs-wide sound engine. */
export function useDocsSfx(): DocsSfxContextValue {
    return useContext(DocsSfxContext);
}
