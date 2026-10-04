import type { ComponentType, ReactNode } from 'react';
import type { UiJson, UiNode } from './spec.types';

/**
 * How a spec prop is checked and turned into a React prop:
 * - `string` / `number` / `boolean` / `json`: passed through (after state reads),
 * - `enum`: a string or number from the component's union type,
 * - `node`: text with templates, or a nested node,
 * - `icon`: an icon name from `UI_ICONS`,
 * - `url`: an `http(s)` URL (or a relative path),
 * - `template`: a format string like `"{value} %"`, turned into `(value) => string`.
 */
export type UiPropKind =
    'string' | 'number' | 'boolean' | 'json' | 'enum' | 'node' | 'icon' | 'url' | 'template';

/**
 * What an event prop passes on as the event value: nothing (`none`), its first argument (`arg`),
 * or `event.target.value` / `event.target.checked` of a native input.
 */
export type UiEventKind = 'none' | 'arg' | 'target-value' | 'target-checked';

/** Props the renderer passes to a component. */
export type UiComponentProps = Record<string, unknown>;

/** Helpers an adapter gets to turn nested spec content into React content. */
export interface UiAdaptContext {
    renderNode: (node: UiNode | string, key: string) => ReactNode;
}

/** What a spec may do with one allowlisted component (data only). */
export interface UiRegistryMeta {
    /** Allowed props and their kinds; anything else is rejected. */
    props: Record<string, UiPropKind>;
    /** Allowed event props and the value they pass to actions. */
    events?: Record<string, UiEventKind>;
    /** Bindable props and the event prop that reports their changes. */
    bind?: Record<string, string>;
    /** What `children` may hold. @default none */
    children?: 'text' | 'nodes';
    /** Whether the node can be addressed with `call` (players). */
    handle?: boolean;
}

/** How one allowlisted component is rendered from a spec. */
export interface UiRegistryEntry extends UiRegistryMeta {
    /** The library component. */
    component: ComponentType<UiComponentProps>;
    /** Turns spec props into component props for props that are not plain values (Table, Tabs). */
    adapt?: (props: UiComponentProps, ctx: UiAdaptContext) => UiComponentProps;
}

/** A JSON object, as found in spec arrays such as table rows. */
export type UiJsonObject = { [key: string]: UiJson };
