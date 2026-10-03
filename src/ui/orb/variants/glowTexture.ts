import { CanvasTexture, SRGBColorSpace } from 'three';
import type { GlowStop } from './glowTexture.types';

const DEFAULT_STOPS: readonly GlowStop[] = [
    [0, 1],
    [0.25, 0.35],
    [1, 0],
];

/** Soft radial white glow (128×128) for sprites and point materials; tint via material color. */
export function makeGlowTexture(stops: readonly GlowStop[] = DEFAULT_STOPS): CanvasTexture {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        for (const [at, alpha] of stops) g.addColorStop(at, `rgba(255,255,255,${alpha})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
}
