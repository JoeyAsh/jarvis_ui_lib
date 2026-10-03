import type { ReactNode } from 'react';
import type { AppOrbState } from '@common/types';

export interface StatusDockProps {
    /**
     * Current assistant state. Every state except `idle` runs the waveform meters and marks the
     * push-to-talk button as active; the StatusLabel shows the matching text, and screen readers
     * announce each change (the label is a polite live region).
     */
    state: AppOrbState;
    /** Called when the built-in push-to-talk button is clicked; unused when `ptt` is set. */
    onPTT?: () => void;
    /** Replaces the built-in PushToTalkButton between the two meters, e.g. with a customized one. */
    ptt?: ReactNode;
    /**
     * Accessible name of the built-in push-to-talk button, e.g. for localization; unused when
     * `ptt` is set.
     * @default 'Push to talk'
     */
    pttLabel?: string;
    /** Additional class names for the root `<div>`, which is fixed to the bottom center. */
    className?: string;
}
