// ================================================================
// jarvis-react-ui/generative — render windows from JSON specs
// (e.g. produced by an assistant). Separate entry so the registry,
// which imports every allowlisted component, stays out of the main
// bundle for apps that do not need it.
// ================================================================

export { UiRenderer } from './UiRenderer';
export type { UiRendererProps, UiRendererHandle } from './UiRenderer';

export { useUiWindows } from './useUiWindows';
export type { UseUiWindowsOptions, UseUiWindowsResult, UiWindowEntry } from './useUiWindows.types';

export { validateUiSpec } from './validate';
export { UI_REGISTRY } from './registry';
export { UI_ICONS } from './icons';

export type {
    UiWindowSpec,
    UiNode,
    UiValue,
    UiJson,
    UiState,
    UiStateRef,
    UiBinding,
    UiAction,
    UiSetAction,
    UiToggleAction,
    UiEmitAction,
    UiCondition,
    UiSpecError,
    UiValidationResult,
    UiActionEvent,
    UiMethod,
} from './spec.types';
export type { UiRegistryEntry, UiPropKind, UiEventKind } from './registry.types';
