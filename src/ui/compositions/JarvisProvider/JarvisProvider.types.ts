import type { ReactNode } from 'react';
import type { AppOrbState } from '@common/types';
import type { ToastPlacement } from '../ToastProvider';

export interface JarvisProviderProps {
    /** Your app. */
    children: ReactNode;
    /**
     * Whether UI sounds start enabled. `false` starts muted; `useJarvis().toggleMute()` can still
     * switch them on. A preference the user set earlier (stored in `localStorage`) wins.
     * @default true
     */
    sfx?: boolean;
    /** Where the sound files are served from, e.g. a CDN URL. @default '/sounds/' */
    soundBaseUrl?: string;
    /** Assistant state driving the ambient/state sounds of the audio engine. @default 'idle' */
    orbState?: AppOrbState;
    /** Connection state; `false` plays the disconnect/offline sounds. @default true */
    connected?: boolean;
    /** Plays a heartbeat loop while idle. @default false */
    heartbeat?: boolean;
    /** Corner or edge where toasts appear. @default 'bottom-right' */
    toastPlacement?: ToastPlacement;
    /** Maximum number of toasts shown at once. @default 3 */
    toastMax?: number;
    /** Default toast lifetime in ms. @default 5000 */
    toastDuration?: number;
}

export interface JarvisContextValue {
    /** Whether UI sounds are currently muted. */
    isMuted: boolean;
    /** Mutes or unmutes UI sounds and stores the choice. */
    toggleMute: () => void;
}
