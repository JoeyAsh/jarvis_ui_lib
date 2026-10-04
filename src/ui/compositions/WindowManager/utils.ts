import type { SlotRect } from '../../window/slotGrid';
import type { ResizeDir } from '../../window/hooks/useResizable';
import type { ContainerGeometry, ExpandedRect, ViewportSize } from './WindowManager.types';
import {
    MIN_EXPANDED_W,
    MIN_EXPANDED_H,
    FLOATING_DEFAULT_W,
    FLOATING_DEFAULT_H,
    CASCADE_OFFSET,
    CASCADE_STEPS,
    FALLBACK_VIEWPORT_W,
    FALLBACK_VIEWPORT_H,
} from './constants';
import { TOP_BAR_HEIGHT } from '../../window/slotGrid';

export function getViewport(): ViewportSize {
    return {
        w: typeof window !== 'undefined' ? window.innerWidth : FALLBACK_VIEWPORT_W,
        h: typeof window !== 'undefined' ? window.innerHeight : FALLBACK_VIEWPORT_H,
    };
}

/**
 * Compute a new SlotRect after a resize gesture.
 */
export function applyResize(
    start: SlotRect,
    dir: ResizeDir,
    dx: number,
    dy: number,
    minW = 120,
    minH = 80,
): SlotRect {
    let { x, y, w, h } = start;

    if (dir.includes('e')) {
        w = Math.max(minW, start.w + dx);
    }
    if (dir.includes('s')) {
        h = Math.max(minH, start.h + dy);
    }
    if (dir.includes('w')) {
        const newW = Math.max(minW, start.w - dx);
        x = start.x + (start.w - newW);
        w = newW;
    }
    if (dir.includes('n')) {
        const newH = Math.max(minH, start.h - dy);
        y = start.y + (start.h - newH);
        h = newH;
    }

    return { x, y, w, h };
}

/** Clamp an expanded rect so it stays within the visible workspace. */
export function clampExpandedRect(rect: ExpandedRect, W: number, H: number): ExpandedRect {
    const w = Math.max(MIN_EXPANDED_W, Math.min(rect.w, W));
    const h = Math.max(MIN_EXPANDED_H, Math.min(rect.h, H - TOP_BAR_HEIGHT));
    const x = Math.max(0, Math.min(rect.x, Math.max(0, W - w)));
    const y = Math.max(TOP_BAR_HEIGHT, Math.min(rect.y, Math.max(TOP_BAR_HEIGHT, H - h)));
    return { x, y, w, h };
}

/**
 * Derive a sensible default floating rect when a window is first expanded.
 * Centers approximately on the slot at ~1.8× width / 1.6× height.
 */
export function defaultExpandedRect(slotRect: SlotRect, W: number, H: number): ExpandedRect {
    const cx = slotRect.x + slotRect.w / 2;
    const cy = slotRect.y + slotRect.h / 2;
    const w = Math.floor(slotRect.w * 1.8);
    const h = Math.floor(slotRect.h * 1.6);
    const x = Math.floor(cx - w / 2);
    const y = Math.floor(cy - h / 2);
    return clampExpandedRect({ x, y, w, h }, W, H);
}

/**
 * Default rect of the `index`-th floating window: centred in the workspace below the top bar and
 * shifted by `CASCADE_OFFSET` per index, so new windows don't cover each other exactly.
 */
export function cascadeRect(index: number, W: number, H: number): ExpandedRect {
    const w = Math.min(FLOATING_DEFAULT_W, W);
    const h = Math.min(FLOATING_DEFAULT_H, H - TOP_BAR_HEIGHT);
    const step = (index % CASCADE_STEPS) * CASCADE_OFFSET;
    const x = Math.floor((W - w) / 2) + step;
    const y = TOP_BAR_HEIGHT + Math.floor((H - TOP_BAR_HEIGHT - h) / 2) + step;
    return clampExpandedRect({ x, y, w, h }, W, H);
}

/** Copy of `record` without `keys`; returns `record` itself when none of them is present. */
export function withoutKeys<T>(record: Record<string, T>, keys: string[]): Record<string, T> {
    if (!keys.some((k) => k in record)) return record;
    const next = { ...record };
    for (const k of keys) delete next[k];
    return next;
}

/**
 * Measure the WindowManager container. Returns its size and viewport offset.
 * Falls back to the full viewport (offset 0,0) when the element is missing or
 * has no layout box (SSR, jsdom, display:none). For a full-screen container
 * (position: fixed; inset: 0) the result equals the viewport, so behaviour is
 * unchanged.
 */
export function measureContainer(el: HTMLElement | null): ContainerGeometry {
    if (el !== null) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
            return { w: r.width, h: r.height, left: r.left, top: r.top };
        }
    }
    const vp = getViewport();
    return { w: vp.w, h: vp.h, left: 0, top: 0 };
}

/** Convert viewport (client) pointer coordinates to container-local coordinates. */
export function toLocalPoint(
    clientX: number,
    clientY: number,
    geometry: ContainerGeometry,
): { x: number; y: number } {
    return { x: clientX - geometry.left, y: clientY - geometry.top };
}
