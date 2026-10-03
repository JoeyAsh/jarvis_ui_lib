import type { ReactNode } from 'react';

export interface DocsSfxRootProps {
    children: ReactNode;
}

export interface DocsSfxContextValue {
    isMuted: boolean;
    toggleMute: () => void;
}
