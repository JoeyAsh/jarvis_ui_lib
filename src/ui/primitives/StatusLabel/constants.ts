import type { AppOrbState } from '@common/types';

/** Built-in status text per orb state; overridable per state via the `labels` prop. */
export const STATUS_LABEL_TEXTS: Record<AppOrbState, string> = {
    idle: 'READY',
    listening: 'listening...',
    thinking: 'thinking...',
    speaking: 'speaking...',
    follow_up: 'follow-up...',
    working: 'working...',
};
