import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ManagedWindow } from '../compositions/WindowManager';
import { UiRenderer } from './UiRenderer';
import type { UiRendererHandle } from './UiRenderer';
import { validateUiSpec } from './validate';
import type { UiState, UiWindowSpec } from './spec.types';
import type { UiWindowEntry, UseUiWindowsOptions, UseUiWindowsResult } from './useUiWindows.types';

/**
 * Manages several generated windows for a `WindowManager`: open (or replace) from a spec, patch a
 * window's state without rebuilding it, call player methods, close. Each window keeps its own
 * state; specs are validated before they open.
 */
export function useUiWindows(options: UseUiWindowsOptions = {}): UseUiWindowsResult {
    const [entries, setEntries] = useState<UiWindowEntry[]>([]);
    const entriesRef = useRef(entries);
    useLayoutEffect(() => {
        entriesRef.current = entries;
    }, [entries]);

    const onActionRef = useRef(options.onAction);
    useLayoutEffect(() => {
        onActionRef.current = options.onAction;
    });

    const renderers = useRef(new Map<string, UiRendererHandle>());

    const update = useCallback((next: (prev: UiWindowEntry[]) => UiWindowEntry[]): void => {
        const value = next(entriesRef.current);
        entriesRef.current = value;
        setEntries(value);
    }, []);

    const open = useCallback(
        (raw: unknown) => {
            const result = validateUiSpec(raw);
            if (!result.ok) return result;
            // validateUiSpec checked the shape, so the spec can be used as a UiWindowSpec.
            const spec = raw as UiWindowSpec;
            const entry: UiWindowEntry = { spec, state: { ...spec.state } };
            update((prev) =>
                prev.some((e) => e.spec.id === spec.id)
                    ? prev.map((e) => (e.spec.id === spec.id ? entry : e))
                    : [...prev, entry],
            );
            return result;
        },
        [update],
    );

    const patchState = useCallback(
        (id: string, patch: UiState) => {
            if (!entriesRef.current.some((e) => e.spec.id === id)) return false;
            update((prev) =>
                prev.map((e) => (e.spec.id === id ? { ...e, state: { ...e.state, ...patch } } : e)),
            );
            return true;
        },
        [update],
    );

    const close = useCallback(
        (id: string) => {
            renderers.current.delete(id);
            update((prev) => prev.filter((e) => e.spec.id !== id));
        },
        [update],
    );

    const getState = useCallback(
        (id: string) => entriesRef.current.find((e) => e.spec.id === id)?.state,
        [],
    );

    const call = useCallback<UseUiWindowsResult['call']>(
        (id, nodeId, method, ...args) =>
            renderers.current.get(id)?.call(nodeId, method, ...args) ?? false,
        [],
    );

    const windows = useMemo<ManagedWindow[]>(
        () =>
            entries.map(({ spec, state }) => ({
                id: spec.id,
                title: spec.title,
                badge: spec.badge,
                floating: true,
                defaultSize: spec.size,
                itemRenderer: () => (
                    <UiRenderer
                        ref={(handle) => {
                            if (handle === null) renderers.current.delete(spec.id);
                            else renderers.current.set(spec.id, handle);
                        }}
                        spec={spec}
                        state={state}
                        onStateChange={(next) => {
                            update((prev) =>
                                prev.map((e) =>
                                    e.spec.id === spec.id ? { ...e, state: next } : e,
                                ),
                            );
                        }}
                        onAction={(event) => onActionRef.current?.(event)}
                    />
                ),
            })),
        [entries, update],
    );

    return { windows, onClose: close, open, patchState, getState, call, close, entries };
}

export default useUiWindows;
