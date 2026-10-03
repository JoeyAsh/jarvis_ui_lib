import type { SlotRect } from '../slotGrid';

export interface SlotGhostProps {
    /** Position and size in pixels, relative to the nearest positioned ancestor. */
    rect: SlotRect;
    /** Small uppercase caption centred in the placeholder, e.g. the slot id. */
    label?: string;
    /** Extra classes for the root `<div>` element (the dashed placeholder). */
    className?: string;
}
