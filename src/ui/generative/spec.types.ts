/**
 * The JSON format an assistant produces to describe a window: a tree of library components with
 * literal props, reads from and bindings to the window state, and actions.
 */

/** Any JSON value. */
export type UiJson = string | number | boolean | null | UiJson[] | { [key: string]: UiJson };

/** The local state of a generated window: flat key/value pairs. */
export type UiState = Record<string, UiJson>;

/** Reads a state value: `{ "$state": "volume" }`. */
export interface UiStateRef {
    $state: string;
}

/**
 * Binds a controlled prop (`value`, `checked`, ...) to a state value in both directions:
 * `{ "$bind": "volume" }`. The matching change handler is wired automatically.
 */
export interface UiBinding {
    $bind: string;
}

/** A prop value: a literal (strings may contain `{{key}}` templates), a state read or a binding. */
export type UiValue = UiJson | UiStateRef | UiBinding;

/** Sets a state value; without `value` the event value is used (e.g. the new slider value). */
export interface UiSetAction {
    set: string;
    value?: UiValue;
}

/** Flips a boolean state value. */
export interface UiToggleAction {
    toggle: string;
}

/** Sends an event to the app: `onAction({ name, payload, windowId })`. Without `payload` the event value is sent. */
export interface UiEmitAction {
    emit: string;
    payload?: UiValue;
}

export type UiAction = UiSetAction | UiToggleAction | UiEmitAction;

/** Shows a node only when the condition holds: truthy without `eq`/`ne`, else (in)equality. */
export interface UiCondition {
    state: string;
    eq?: UiJson;
    ne?: UiJson;
}

/** One element of the tree. */
export interface UiNode {
    /** Component name from the allowlist, e.g. `Slider`. */
    type: string;
    /** Id to address the node, e.g. to control a player through `call(windowId, id, 'seek', 90)`. */
    id?: string;
    /** Props of the component. */
    props?: Record<string, UiValue | UiNode>;
    /** Text (with `{{key}}` templates) or child nodes. */
    children?: string | number | (UiNode | string)[];
    /** Actions per event prop, e.g. `{ "onClick": [{ "emit": "run" }] }`. */
    on?: Record<string, UiAction | UiAction[]>;
    /** Renders the node only while the condition holds. */
    visibleIf?: UiCondition;
}

/** A generated window. */
export interface UiWindowSpec {
    /** Unique id; opening a spec with an existing id replaces that window. */
    id: string;
    /** Header title. */
    title?: string;
    /** Tag at the right end of the header, e.g. `LIVE`. */
    badge?: string;
    /** Initial size in px; the window opens centred and cascades. */
    size?: { w: number; h: number };
    /** Initial state values. */
    state?: UiState;
    /** Content of the window. */
    root: UiNode;
}

/** A problem found in a spec, with the JSON path where it occurs. */
export interface UiSpecError {
    path: string;
    message: string;
}

/** Result of `validateUiSpec`. */
export interface UiValidationResult {
    ok: boolean;
    errors: UiSpecError[];
}

/** An `emit` action that reached the app. */
export interface UiActionEvent {
    windowId: string;
    name: string;
    payload: UiJson | undefined;
}

/** Methods that `call` may invoke on addressable nodes (players). */
export type UiMethod = 'play' | 'pause' | 'seek' | 'setVolume' | 'setMuted';
