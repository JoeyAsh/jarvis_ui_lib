import type { ReactNode } from 'react';
import type { SlotId } from '../../window/slotGrid';
import type { PanelMode, PanelContentRenderProps } from '../../window/Window';

/** Per-window local state tracked internally by WindowManager. */
export type WindowLocalState = 'idle' | 'resizing';

export type { PanelMode, PanelContentRenderProps };

/** Internal per-drag state (compact slot-drag). */
export interface ActiveDrag {
    windowId: string;
    /** Slot the dragged window was in at the start of the drag. */
    originSlot: SlotId;
}

/** Per-window free-drag tracking (expanded mode). */
export interface FreeDrag {
    windowId: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
}

/** Read-only viewport dimensions. */
export interface ViewportSize {
    w: number;
    h: number;
}

/** Container size plus its offset from the browser viewport origin. */
export interface ContainerGeometry extends ViewportSize {
    /** Distance from the viewport's left edge to the container's left edge. */
    left: number;
    /** Distance from the viewport's top edge to the container's top edge. */
    top: number;
}

/** One window rendered by `WindowManager`. */
export interface ManagedWindow {
    /** Unique window id; used as the key in `assignments`, `modes` and `focusedId`. */
    id: string;
    /** Header title. It also names the window region (`aria-labelledby`). */
    title?: ReactNode;
    /** Index glyph shown before the title, e.g. `◈`. */
    ix?: ReactNode;
    /** Tag shown at the right end of the header, e.g. `LIVE`. */
    badge?: ReactNode;
    /**
     * Render-prop content. Receives the current mode, focused state, and
     * dragging state so the consumer can render compact vs expanded views.
     */
    itemRenderer: (props: PanelContentRenderProps) => ReactNode;
}

/** Rectangular geometry used for the expanded (free-floating) position. */
export interface ExpandedRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface WindowManagerProps {
    /** Windows to render. A window without an entry in `assignments` is not rendered. */
    windows: ManagedWindow[];
    /** Window id → slot id (controlled). Each window is docked in its assigned slot. */
    assignments: Record<string, SlotId>;
    /**
     * Called with the next assignments when a window is dropped on another slot (move), on an
     * occupied slot (swap) or reset to its home slot.
     */
    onAssignmentsChange: (next: Record<string, SlotId>) => void;
    /**
     * Home slots restored by a window's Reset button. Changes to this prop are picked up by the
     * next reset. Without it, the `assignments` of the first render are used.
     */
    homeAssignments?: Record<string, SlotId>;
    /** Id of the focused window (controlled); `null` for none. @default null */
    focusedId?: string | null;
    /**
     * Called with a window id when a window is pressed, dragged or toggled, and with `null` on a
     * pointer down outside every window.
     */
    onFocusChange?: (id: string | null) => void;

    // ── Mode — controlled/uncontrolled ────────────────────────────────────────

    /**
     * Window id → `compact` | `expanded` (controlled). Missing ids are `compact`. Omit it to let
     * WindowManager track modes internally.
     */
    modes?: Record<string, PanelMode>;
    /**
     * Called with the full next mode map when a window is undocked, docked or reset. Fires in
     * both controlled and uncontrolled mode.
     */
    onModesChange?: (next: Record<string, PanelMode>) => void;

    /**
     * Window id → free-floating rect (controlled). When set, WindowManager no longer stores
     * positions itself: apply the maps passed to `onExpandedRectsChange` to move and resize
     * expanded windows. Omit it to let WindowManager track them.
     */
    expandedRects?: Record<string, ExpandedRect>;
    /**
     * Called with the full next rect map when a window is undocked, an expanded window is moved
     * (on drag end) or resized (on every resize move), or a window is reset. Fires in both
     * controlled and uncontrolled mode.
     */
    onExpandedRectsChange?: (next: Record<string, ExpandedRect>) => void;

    /** Additional class names for the root element. */
    className?: string;
}
