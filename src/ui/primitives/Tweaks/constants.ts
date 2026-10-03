import type { TweaksState } from './Tweaks.types';

/** Starting values for the `Tweaks` panel; use them as the initial state. */
export const TWEAKS_DEFAULTS: TweaksState = {
    hue: 215,
    glow: 74,
    scan: true,
    grid: true,
    rings: true,
    particles: true,
    idleDim: true,
};

/** Hues (degrees) offered as swatches in the panel. */
export const HUE_SWATCHES: readonly number[] = [215, 28, 150, 280, 0];

/** CSS custom properties `useTweakApply` writes to `:root` and removes again on unmount. */
export const TWEAK_CSS_VARS: readonly string[] = [
    '--tweak-hue',
    '--accent',
    '--accent-bright',
    '--accent-speak',
    '--accent-dim',
    '--glow',
    '--glow-strong',
];
