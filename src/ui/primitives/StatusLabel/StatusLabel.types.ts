import type { AppOrbState } from '@common/types';

export interface StatusLabelProps {
    /**
     * Current orb state; selects the status text (`READY`, `listening...`, ...) and highlights it
     * in the accent color for every state except `idle`.
     */
    state: AppOrbState;
    /**
     * Brand text shown in small, widely spaced letters below the status.
     * @default 'J A R V I S'
     */
    brand?: string;
    /** Extra classes for the root `<div>` element. */
    className?: string;
}
