import type { ParticleConfig } from './CssOrb.types';

/** Media query for the user's reduced-motion preference, or `null` where `matchMedia` is missing. */
export function reducedMotionQuery(): MediaQueryList | null {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
    return window.matchMedia('(prefers-reduced-motion: reduce)');
}

/** CSS transform that places a particle on its orbit at time `t` (seconds). */
export function particleTransform(cfg: ParticleConfig, t: number): string {
    const angle = ((t * 2 * Math.PI) / cfg.period) * cfg.dir + cfg.phase;
    const x = Math.cos(angle) * cfg.radius;
    const y = Math.sin(angle) * cfg.radius;
    return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
}
