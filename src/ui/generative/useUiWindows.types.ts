import type { ManagedWindow } from '../compositions/WindowManager';
import type {
    UiActionEvent,
    UiJson,
    UiMethod,
    UiState,
    UiValidationResult,
    UiWindowSpec,
} from './spec.types';

/** Options of `useUiWindows`. */
export interface UseUiWindowsOptions {
    /** Called for every `emit` action of any window. */
    onAction?: (event: UiActionEvent) => void;
}

/** One open generated window. */
export interface UiWindowEntry {
    spec: UiWindowSpec;
    state: UiState;
}

/** What `useUiWindows` returns. */
export interface UseUiWindowsResult {
    /** Pass to `WindowManager` as `windows` (floating, closable). */
    windows: ManagedWindow[];
    /** Pass to `WindowManager` as `onClose`. */
    onClose: (id: string) => void;
    /**
     * Validates and opens a window; a spec with the id of an open window replaces it (its state
     * starts over from `spec.state`). Invalid specs are not opened; the errors are returned.
     */
    open: (spec: unknown) => UiValidationResult;
    /** Merges values into a window's state, e.g. `patchState('volume', { volume: 20 })`. */
    patchState: (id: string, patch: UiState) => boolean;
    /** The current state of a window, e.g. to answer "what is the volume?". */
    getState: (id: string) => UiState | undefined;
    /** Calls a player method on a node with an `id`: `call('yt', 'player', 'seek', 90)`. */
    call: (id: string, nodeId: string, method: UiMethod, ...args: UiJson[]) => boolean;
    /** Closes a window. */
    close: (id: string) => void;
    /** The open windows with their specs and state, in opening order. */
    entries: UiWindowEntry[];
}
