import { useEffect } from 'react';
import { TWEAK_CSS_VARS } from './constants';
import type { TweaksState } from './Tweaks.types';

/**
 * Writes the accent and glow CSS variables for `tweaks.hue` / `tweaks.glow` to `:root`
 * (`document.documentElement`) whenever they change, and removes them again when the calling
 * component unmounts, so the stylesheet tokens apply again.
 */
export function useTweakApply(tweaks: TweaksState): void {
    const { hue, glow } = tweaks;

    useEffect(() => {
        const r = document.documentElement;
        const l = 0.72;
        const c = 0.14;
        r.style.setProperty('--tweak-hue', String(hue));
        r.style.setProperty('--accent', `oklch(${l} ${c} ${hue})`);
        r.style.setProperty('--accent-bright', `oklch(${l + 0.1} ${c + 0.02} ${hue})`);
        r.style.setProperty('--accent-speak', `oklch(${l + 0.05} ${c + 0.01} ${hue})`);
        r.style.setProperty('--accent-dim', `oklch(${l - 0.2} ${c - 0.04} ${hue})`);
        r.style.setProperty(
            '--glow',
            `0 0 ${6 + glow * 0.1}px oklch(${l} ${c} ${hue} / ${0.4 + glow * 0.005})`,
        );
        r.style.setProperty(
            '--glow-strong',
            `0 0 ${12 + glow * 0.2}px oklch(${l} ${c} ${hue} / ${0.5 + glow * 0.005}), 0 0 ${28 + glow * 0.3}px oklch(${l} ${c} ${hue} / ${0.25 + glow * 0.003})`,
        );
    }, [hue, glow]);

    useEffect(() => {
        const r = document.documentElement;
        return () => {
            TWEAK_CSS_VARS.forEach((name) => r.style.removeProperty(name));
        };
    }, []);
}
