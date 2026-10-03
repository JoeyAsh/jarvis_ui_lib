import type { AppOrbState } from '@common/types';
import type { LandingFeature } from './Landing.types';

/** Orb states the landing hero cycles through. */
export const ORB_CYCLE: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'working'];

/** Time each orb state is shown on the landing hero. */
export const ORB_CYCLE_MS = 2600;

export const LANDING_FEATURES: LandingFeature[] = [
    {
        icon: 'grid',
        title: 'Window grid',
        text: 'Drag, resize and snap panels on a 9-slot grid with swap and free-float modes.',
    },
    {
        icon: 'orbit',
        title: 'Animated orb',
        text: 'A CSS orb with five states, plus a Three.js orb in its own lazy entry point.',
    },
    {
        icon: 'sound',
        title: 'UI sound',
        text: 'Hover, click, drag and boot sounds through a tiny React context. Silent by default.',
    },
    {
        icon: 'palette',
        title: 'Token theming',
        text: 'Every color, glow and timing is a CSS custom property. One override re-themes all.',
    },
    {
        icon: 'typed',
        title: 'Typed & accessible',
        text: 'Strict TypeScript declarations, keyboard support and ARIA roles throughout.',
    },
    {
        icon: 'light',
        title: 'One stylesheet',
        text: 'Ships compiled CSS. No Tailwind setup needed in your project.',
    },
];
