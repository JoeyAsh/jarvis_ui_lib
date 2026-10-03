import type { SlotRect } from '../slotGrid';

export interface SwapOverlayProps {
    /** Whether the ghost is drawn; nothing is drawn while `false` or without a `ghostRect`. */
    active: boolean;
    /** Rect of the window that would be swapped, or `null` for no ghost. */
    ghostRect: SlotRect | null;
    /**
     * Highlights the ghost with a stronger fill and glow, e.g. while the drop would swap.
     * @default false
     */
    hovered?: boolean;
    /** Extra classes for the root `<div>` element (the fixed full-size layer). */
    className?: string;
}
