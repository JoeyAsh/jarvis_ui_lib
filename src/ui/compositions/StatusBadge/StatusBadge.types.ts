export type StatusBadgeState = 'online' | 'offline' | 'warn';

export interface StatusBadgeProps {
    /**
     * Text next to the status dot; displayed in uppercase.
     * @default 'LINK · SECURE'
     */
    label?: string;
    /**
     * Connection state; sets the dot color: `online` green, `warn` amber, `offline` muted gray.
     * @default 'online'
     */
    state?: StatusBadgeState;
    /**
     * Lets the dot pulse while `state` is `online`; ignored for the other states and under
     * `prefers-reduced-motion`.
     * @default true
     */
    pulse?: boolean;
    /** Additional class names for the root `<span>`. */
    className?: string;
}
