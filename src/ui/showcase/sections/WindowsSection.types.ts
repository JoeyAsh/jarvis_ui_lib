import type { PanelMode } from '../../compositions/WindowManager';
import type { SlotId } from '../../window/slotGrid';

/** One row of the live window-state table in the Windows section. */
export interface WindowStateRow {
    id: string;
    slot: SlotId;
    mode: PanelMode;
}
