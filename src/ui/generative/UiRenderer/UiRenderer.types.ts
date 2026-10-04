import type { MediaHandle } from '../../compositions/MediaPlayer/MediaPlayer.types';
import type {
    UiAction,
    UiActionEvent,
    UiJson,
    UiMethod,
    UiSpecError,
    UiState,
    UiWindowSpec,
} from '../spec.types';

/** Props of the `UiRenderer` component. */
export interface UiRendererProps {
    /** The window spec to render; only its `root` and initial `state` are used here. */
    spec: UiWindowSpec;
    /**
     * Controlled state. Leave undefined to keep the state inside the renderer, starting from
     * `spec.state`.
     */
    state?: UiState;
    /** Called with the full next state whenever a binding or a `set` / `toggle` action changes it. */
    onStateChange?: (state: UiState) => void;
    /** Called for every `emit` action. */
    onAction?: (event: UiActionEvent) => void;
    /** Called with the problems `validateUiSpec` finds; invalid parts render as placeholders. */
    onError?: (errors: UiSpecError[]) => void;
}

/** Imperative access to addressable nodes (players with an `id`). */
export interface UiRendererHandle {
    /**
     * Calls `method` on the node with `nodeId`, e.g. `call('player', 'seek', 90)`. Returns `false`
     * when there is no such node or it has no such method.
     */
    call: (nodeId: string, method: UiMethod, ...args: UiJson[]) => boolean;
}

/** What every node of one renderer shares. */
export interface UiRenderContext {
    state: UiState;
    patch: (patch: UiState) => void;
    run: (actions: UiAction | UiAction[], value: UiJson | undefined) => void;
    registerHandle: (nodeId: string, handle: MediaHandle | null) => void;
}

/** Props of the internal node view. */
export interface UiNodeViewProps {
    node: unknown;
    path: string;
    ctx: UiRenderContext;
}

/** Props of the placeholder shown for invalid nodes. */
export interface UiInvalidProps {
    message: string;
}
