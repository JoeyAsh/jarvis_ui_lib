import type { CSSProperties } from 'react';
import type { SlotRect } from './slotGrid';

/**
 * Turns a pixel rect into CSS custom properties (`--<prefix>-x/y/w/h`) for CSS-variable
 * injection. The component stylesheet maps them onto `left` / `top` / `width` / `height`, so
 * components never set raw geometry as inline styles.
 *
 * @example
 * rectVars('lib-slot-ghost', { x: 12, y: 72, w: 316, h: 250 })
 * // => { '--lib-slot-ghost-x': '12px', '--lib-slot-ghost-y': '72px', ... }
 */
export function rectVars(prefix: string, rect: SlotRect): CSSProperties {
    const vars: Record<string, string> = {
        [`--${prefix}-x`]: `${rect.x}px`,
        [`--${prefix}-y`]: `${rect.y}px`,
        [`--${prefix}-w`]: `${rect.w}px`,
        [`--${prefix}-h`]: `${rect.h}px`,
    };
    return vars;
}
