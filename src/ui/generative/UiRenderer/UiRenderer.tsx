import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { MediaHandle } from '../../compositions/MediaPlayer/MediaPlayer.types';
import { resolveValue } from '../resolve';
import { validateUiSpec } from '../validate';
import type { UiAction, UiJson, UiState } from '../spec.types';
import { UiNodeView } from './UiNodeView';
import type { UiRenderContext, UiRendererHandle, UiRendererProps } from './UiRenderer.types';

/**
 * Renders a generated window spec with library components: state reads and bindings, `{{key}}`
 * templates, `visibleIf` and actions. The state lives inside the renderer unless `state` is
 * passed (controlled). Invalid parts render as placeholders and are reported through `onError`.
 */
export const UiRenderer = forwardRef<UiRendererHandle, UiRendererProps>(function UiRenderer(
    { spec, state: stateProp, onStateChange, onAction, onError },
    ref,
) {
    const [internal, setInternal] = useState<UiState>(() => ({ ...spec.state }));
    const state = stateProp ?? internal;

    // The latest state, also between renders: several actions of one event build on each other.
    const latest = useRef(state);
    useLayoutEffect(() => {
        latest.current = state;
    }, [state]);

    const callbacks = useRef({ onStateChange, onAction, onError });
    useLayoutEffect(() => {
        callbacks.current = { onStateChange, onAction, onError };
    });

    const handles = useRef(new Map<string, MediaHandle>());

    const validation = useMemo(() => validateUiSpec(spec), [spec]);
    useEffect(() => {
        if (!validation.ok) callbacks.current.onError?.(validation.errors);
    }, [validation]);

    const ctx = useMemo<UiRenderContext>(() => {
        const patch = (p: UiState): void => {
            const next = { ...latest.current, ...p };
            latest.current = next;
            if (stateProp === undefined) setInternal(next);
            callbacks.current.onStateChange?.(next);
        };
        const run = (actions: UiAction | UiAction[], value: UiJson | undefined): void => {
            for (const action of Array.isArray(actions) ? actions : [actions]) {
                const current = latest.current;
                if ('set' in action) {
                    const next =
                        action.value === undefined ? value : resolveValue(action.value, current);
                    patch({ [action.set]: next ?? null });
                } else if ('toggle' in action) {
                    patch({ [action.toggle]: !current[action.toggle] });
                } else if ('emit' in action) {
                    const payload =
                        action.payload === undefined
                            ? value
                            : resolveValue(action.payload, current);
                    callbacks.current.onAction?.({
                        windowId: spec.id,
                        name: action.emit,
                        payload,
                    });
                }
            }
        };
        const registerHandle = (nodeId: string, handle: MediaHandle | null): void => {
            if (handle === null) handles.current.delete(nodeId);
            else handles.current.set(nodeId, handle);
        };
        return { state, patch, run, registerHandle };
    }, [state, stateProp, spec.id]);

    useImperativeHandle(
        ref,
        () => ({
            call: (nodeId, method, ...args) => {
                const handle = handles.current.get(nodeId);
                if (handle === undefined) return false;
                const [arg] = args;
                switch (method) {
                    case 'play':
                        void handle.play().catch(() => undefined);
                        return true;
                    case 'pause':
                        handle.pause();
                        return true;
                    case 'seek':
                        if (typeof arg !== 'number') return false;
                        handle.seek(arg);
                        return true;
                    case 'setVolume':
                        if (typeof arg !== 'number') return false;
                        handle.setVolume(arg);
                        return true;
                    case 'setMuted':
                        if (typeof arg !== 'boolean') return false;
                        handle.setMuted(arg);
                        return true;
                    default:
                        return false;
                }
            },
        }),
        [],
    );

    return (
        <div className="flex flex-col h-full min-h-0 font-mono" data-ui-window={spec.id}>
            <UiNodeView node={spec.root} path="$.root" ctx={ctx} />
        </div>
    );
});

UiRenderer.displayName = 'UiRenderer';

export default UiRenderer;
