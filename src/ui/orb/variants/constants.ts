import type { OrbVariant, OrbVisualState } from './variants.types';

/** Number of audio bands the variants visualize. */
export const BAND_COUNT = 16;

/** Visual states in display order. */
export const ORB_VISUAL_STATES: readonly OrbVisualState[] = [
    'idle',
    'listening',
    'working',
    'speaking',
];

/** Variant names in display order. */
export const ORB_VARIANTS: readonly OrbVariant[] = [
    'particle',
    'halo',
    'signal',
    'reactor',
    'lattice',
];

/** Lowest and highest frequency of the log-spaced audio bands. */
export const BAND_MIN_HZ = 80;
export const BAND_RANGE = 100; // 80 Hz · 100 = 8 kHz
