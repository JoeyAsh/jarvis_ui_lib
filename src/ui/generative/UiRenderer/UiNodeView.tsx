import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { MediaHandle } from '../../compositions/MediaPlayer/MediaPlayer.types';
import { UI_ICONS } from '../icons';
import { UI_REGISTRY } from '../registry';
import {
    evaluateCondition,
    eventValue,
    formatter,
    interpolate,
    isBinding,
    isNode,
    isSafeUrl,
    resolveValue,
} from '../resolve';
import type { UiComponentProps } from '../registry.types';
import type { UiAction } from '../spec.types';
import { UiInvalid } from './UiInvalid';
import type { UiNodeViewProps } from './UiRenderer.types';

/**
 * Renders one spec node and, recursively, its children. Props that are not allowlisted for the
 * component, or whose value does not fit, are left out; unknown components render a placeholder.
 */
export function UiNodeView({ node, path, ctx }: UiNodeViewProps): ReactElement | null {
    if (!isNode(node)) return <UiInvalid message="Invalid element" />;
    const entry = UI_REGISTRY[node.type];
    if (entry === undefined) return <UiInvalid message={`Unknown component "${node.type}"`} />;
    if (node.visibleIf !== undefined && !evaluateCondition(node.visibleIf, ctx.state)) return null;

    const { state } = ctx;
    const renderChild = (child: unknown, key: string): ReactNode =>
        typeof child === 'string' || typeof child === 'number' ? (
            interpolate(String(child), state)
        ) : (
            <UiNodeView key={key} node={child} path={key} ctx={ctx} />
        );

    const props: UiComponentProps = {};
    // Event prop → state key it writes, for two-way bindings.
    const bound: Record<string, string> = {};

    for (const [name, raw] of Object.entries(node.props ?? {})) {
        const kind = entry.props[name];
        if (kind === undefined) continue;
        if (isBinding(raw)) {
            const event = entry.bind?.[name];
            if (event === undefined) continue;
            props[name] = state[raw.$bind];
            bound[event] = raw.$bind;
            continue;
        }
        if (kind === 'node') {
            props[name] = renderChild(raw, `${path}.props.${name}`);
            continue;
        }
        const value = resolveValue(isNode(raw) ? undefined : raw, state);
        if (value === undefined) continue;
        if (kind === 'icon') {
            const icon = typeof value === 'string' ? UI_ICONS[value] : undefined;
            if (icon !== undefined) props[name] = icon;
        } else if (kind === 'template') {
            if (typeof value === 'string') props[name] = formatter(value);
        } else if (kind === 'url') {
            if (typeof value === 'string' && isSafeUrl(value)) props[name] = value;
        } else {
            props[name] = value;
        }
    }

    for (const [event, eventKind] of Object.entries(entry.events ?? {})) {
        const actions: UiAction | UiAction[] | undefined = node.on?.[event];
        const bindKey = bound[event];
        if (actions === undefined && bindKey === undefined) continue;
        props[event] = (...args: unknown[]): void => {
            const value = eventValue(eventKind, args);
            if (bindKey !== undefined && value !== undefined) ctx.patch({ [bindKey]: value });
            if (actions !== undefined) ctx.run(actions, value);
        };
    }

    if (entry.handle === true && typeof node.id === 'string') {
        const id = node.id;
        props.ref = (handle: MediaHandle | null): void => ctx.registerHandle(id, handle);
    }

    let children: ReactNode = undefined;
    if (entry.children !== undefined && node.children !== undefined) {
        if (Array.isArray(node.children)) {
            children =
                entry.children === 'nodes'
                    ? node.children.map((child, i) => renderChild(child, `${path}.children[${i}]`))
                    : undefined;
        } else {
            children = interpolate(String(node.children), state);
        }
    }

    const finalProps = entry.adapt
        ? entry.adapt(props, { renderNode: (child, key) => renderChild(child, `${path}.${key}`) })
        : props;

    return createElement(entry.component, finalProps, children);
}

export default UiNodeView;
