import type { SlotId, SlotRect } from '../slotGrid';

export interface SnapOverlayProps {
    /** Whether the slot zones are drawn; while `false` only an empty layer is rendered. */
    active: boolean;
    /** Rect of every slot, usually from `computeAllSlots(width, height)`. */
    slotRects: Record<SlotId, SlotRect>;
    /** Slot under the pointer; its zone is highlighted and pulses. `null` highlights none. */
    hoveredSlot: SlotId | null;
    /** Extra classes for the root `<div>` element (the fixed full-size layer). */
    className?: string;
}
