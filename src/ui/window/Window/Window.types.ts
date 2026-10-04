import type { ReactNode } from 'react';
import type { ResizeDir } from '../hooks/useResizable';

/** `compact`: docked in a slot. `expanded`: free-floating and resizable. */
export type PanelMode = 'compact' | 'expanded';

/** Window state passed to `itemRenderer`, so content can adapt to docked or floating mode. */
export interface PanelContentRenderProps {
    /** `compact` while docked in a slot, `expanded` while free-floating. */
    mode: PanelMode;
    /** Whether the window is currently focused. */
    focused: boolean;
    /** Whether the window is being dragged or resized right now. */
    dragging: boolean;
}

/** Visual state of a window, exposed as `data-state` on the root element for styling. */
export type WindowState =
    'idle' | 'dragging' | 'snap-preview' | 'swap-preview' | 'settling' | 'focused' | 'resizing';

export interface WindowProps {
    /** Unique window id; passed back as the first argument of every callback. */
    id: string;
    /** Header title. It also names the window region (`aria-labelledby` points at it). */
    title?: ReactNode;
    /** Index glyph shown before the title in the header. */
    ix?: ReactNode;
    /** Tag shown at the right end of the header. */
    badge?: ReactNode;
    /**
     * Position and size in pixels, relative to the nearest positioned ancestor. The window does not
     * move itself: apply the deltas from `onDragMove` / `onResizeMove` to this rect.
     */
    position: { x: number; y: number; w: number; h: number };
    /**
     * Visual state; `dragging` and `resizing` are also set automatically during a gesture.
     * @default 'idle'
     */
    state?: WindowState;
    /**
     * Whether the window is focused; highlights the panel chrome.
     * @default false
     */
    focused?: boolean;
    /**
     * `compact` hides the resize handles and shows the undock button, `expanded` shows the
     * handles and the dock button.
     * @default 'compact'
     */
    mode?: PanelMode;
    /** Called with the id on any pointer down inside the window. */
    onFocus?: (id: string) => void;
    /**
     * Called with the native `pointerdown` event when a header drag starts (not on the header
     * buttons).
     */
    onDragStart?: (id: string, e: PointerEvent) => void;
    /** Called on every pointer move of a header drag with the offset from the drag start. */
    onDragMove?: (id: string, dx: number, dy: number, e: PointerEvent) => void;
    /** Called when the header drag ends (pointer up or cancel). */
    onDragEnd?: (id: string, e: PointerEvent) => void;
    /**
     * Called with the native `pointerdown` event when a resize starts on one of the eight edge and
     * corner handles.
     */
    onResizeStart?: (id: string, dir: ResizeDir, e: PointerEvent) => void;
    /** Called on every pointer move of a resize with the handle direction and offset. */
    onResizeMove?: (id: string, dir: ResizeDir, dx: number, dy: number, e: PointerEvent) => void;
    /** Called when the resize ends. */
    onResizeEnd?: (id: string, e: PointerEvent) => void;
    /** Shows a reset button in the header and is called when it is clicked. */
    onReset?: (id: string) => void;
    /** Shows a close button in the header and is called when it is clicked. */
    onClose?: (id: string) => void;
    /**
     * Shows a dock/undock button in the header; called when it is clicked or the header is
     * double-clicked. Both play the `expand` / `collapse` sound.
     */
    onModeToggle?: (id: string) => void;
    /**
     * Whether the header can be dragged.
     * @default true
     */
    draggable?: boolean;
    /**
     * Whether the resize handles are rendered; they are visible in `expanded` mode only.
     * @default true
     */
    resizable?: boolean;
    /** Extra classes for the root `<div role="region">` element. */
    className?: string;
    /** Renders the window body; receives the current `mode`, `focused` and `dragging`. */
    itemRenderer: (props: PanelContentRenderProps) => ReactNode;
}
