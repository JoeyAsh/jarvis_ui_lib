import type { AppOrbState } from '@common/types';

export interface StatusLabelProps {
    /**
     * Current orb state; selects the status text (`READY`, `listening...`, ...) and highlights it
     * in the accent color for every state except `idle`.
     */
    state: AppOrbState;
    /**
     * Custom status texts per state, e.g. for localization; states you leave out keep their
     * built-in text (`READY`, `listening...`, `thinking...`, `speaking...`, `follow-up...`,
     * `working...`).
     */
    labels?: Partial<Record<AppOrbState, string>>;
    /**
     * Turns the status text into a polite live region (`role="status"`, `aria-live="polite"`), so
     * screen readers announce state changes.
     * @default false
     */
    live?: boolean;
    /**
     * Brand text shown in small, widely spaced letters below the status.
     * @default 'J A R V I S'
     */
    brand?: string;
    /** Extra classes for the root `<div>` element. */
    className?: string;
}
