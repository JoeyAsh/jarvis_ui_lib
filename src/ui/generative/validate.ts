import { UI_ICONS } from './icons';
import { UI_REGISTRY_META } from './registry.meta';
import { isBinding, isNode, isPlainObject, isSafeUrl, isStateRef } from './resolve';
import type { UiPropKind, UiRegistryMeta } from './registry.types';
import type { UiSpecError, UiValidationResult } from './spec.types';

/** Nesting limit, so a broken or hostile spec cannot recurse without end. */
const MAX_DEPTH = 24;

/** Node limit per window. */
const MAX_NODES = 500;

interface Walk {
    errors: UiSpecError[];
    nodes: number;
    stateKeys: Set<string>;
}

function checkKind(
    kind: UiPropKind,
    value: unknown,
    path: string,
    walk: Walk,
    depth: number,
): void {
    const fail = (message: string): void => {
        walk.errors.push({ path, message });
    };
    if (isStateRef(value) || isBinding(value)) return;
    switch (kind) {
        case 'string':
            if (typeof value !== 'string') fail('expected a string');
            return;
        case 'number':
            if (typeof value !== 'number' || !Number.isFinite(value)) fail('expected a number');
            return;
        case 'boolean':
            if (typeof value !== 'boolean') fail('expected a boolean');
            return;
        case 'enum':
            if (typeof value !== 'string' && typeof value !== 'number') {
                fail('expected one of the allowed values');
            }
            return;
        case 'template':
            if (typeof value !== 'string') fail('expected a format string like "{value} %"');
            return;
        case 'icon':
            if (typeof value !== 'string' || !(value in UI_ICONS)) {
                fail(`unknown icon; use one of: ${Object.keys(UI_ICONS).join(', ')}`);
            }
            return;
        case 'url':
            if (typeof value !== 'string' || !isSafeUrl(value)) {
                fail('expected an http(s) URL or a relative path');
            }
            return;
        case 'node':
            if (typeof value === 'string' || typeof value === 'number') return;
            if (isNode(value)) {
                checkNode(value, path, walk, depth + 1);
                return;
            }
            fail('expected text or a node');
            return;
        case 'json':
            if (typeof value === 'function' || value === undefined) fail('expected JSON');
            return;
    }
}

function checkActions(value: unknown, path: string, walk: Walk): void {
    const list = Array.isArray(value) ? value : [value];
    list.forEach((action, i) => {
        const at = Array.isArray(value) ? `${path}[${i}]` : path;
        if (!isPlainObject(action)) {
            walk.errors.push({ path: at, message: 'expected an action object' });
            return;
        }
        if (typeof action.set === 'string' || typeof action.toggle === 'string') return;
        if (typeof action.emit === 'string' && action.emit !== '') return;
        walk.errors.push({
            path: at,
            message: 'an action needs "set", "toggle" or "emit" with a name',
        });
    });
}

function checkNode(node: unknown, path: string, walk: Walk, depth: number): void {
    if (depth > MAX_DEPTH) {
        walk.errors.push({ path, message: `nesting deeper than ${MAX_DEPTH} levels` });
        return;
    }
    walk.nodes += 1;
    if (walk.nodes > MAX_NODES) {
        if (walk.nodes === MAX_NODES + 1) {
            walk.errors.push({ path, message: `more than ${MAX_NODES} nodes` });
        }
        return;
    }
    if (!isNode(node)) {
        walk.errors.push({ path, message: 'expected a node with a "type"' });
        return;
    }
    const entry: UiRegistryMeta | undefined = (UI_REGISTRY_META as Record<string, UiRegistryMeta>)[
        node.type
    ];
    if (entry === undefined) {
        walk.errors.push({ path: `${path}.type`, message: `unknown component "${node.type}"` });
        return;
    }

    if (node.props !== undefined) {
        if (!isPlainObject(node.props)) {
            walk.errors.push({ path: `${path}.props`, message: 'expected an object' });
        } else {
            for (const [name, value] of Object.entries(node.props)) {
                const at = `${path}.props.${name}`;
                const kind = entry.props[name];
                if (kind === undefined) {
                    walk.errors.push({ path: at, message: `"${node.type}" has no prop "${name}"` });
                    continue;
                }
                if (isBinding(value)) {
                    if (entry.bind?.[name] === undefined) {
                        walk.errors.push({ path: at, message: `"${name}" cannot be bound` });
                    } else if (!walk.stateKeys.has(value.$bind)) {
                        walk.errors.push({
                            path: at,
                            message: `state "${value.$bind}" is not declared in "state"`,
                        });
                    }
                    continue;
                }
                checkKind(kind, value, at, walk, depth);
            }
        }
    }

    if (node.children !== undefined) {
        const at = `${path}.children`;
        if (entry.children === undefined) {
            walk.errors.push({ path: at, message: `"${node.type}" takes no children` });
        } else if (Array.isArray(node.children)) {
            if (entry.children === 'text') {
                walk.errors.push({ path: at, message: 'expected text' });
            } else {
                node.children.forEach((child, i) => {
                    if (typeof child !== 'string') checkNode(child, `${at}[${i}]`, walk, depth + 1);
                });
            }
        } else if (typeof node.children !== 'string' && typeof node.children !== 'number') {
            walk.errors.push({ path: at, message: 'expected text or an array of nodes' });
        }
    }

    if (node.on !== undefined) {
        if (!isPlainObject(node.on)) {
            walk.errors.push({ path: `${path}.on`, message: 'expected an object' });
        } else {
            for (const [event, actions] of Object.entries(node.on)) {
                if (entry.events?.[event] === undefined) {
                    walk.errors.push({
                        path: `${path}.on.${event}`,
                        message: `"${node.type}" has no event "${event}"`,
                    });
                    continue;
                }
                checkActions(actions, `${path}.on.${event}`, walk);
            }
        }
    }

    if (node.visibleIf !== undefined) {
        const cond = node.visibleIf;
        if (!isPlainObject(cond) || typeof cond.state !== 'string') {
            walk.errors.push({
                path: `${path}.visibleIf`,
                message: 'expected { "state": "key", "eq"?: value, "ne"?: value }',
            });
        }
    }

    if (node.id !== undefined && typeof node.id !== 'string') {
        walk.errors.push({ path: `${path}.id`, message: 'expected a string' });
    }
}

/**
 * Checks a window spec against the allowlist: known components and props, value kinds, bindings
 * to declared state, actions, conditions, icons and URLs. Returns every problem with its path, so
 * an assistant can be asked to fix the spec.
 */
export function validateUiSpec(spec: unknown): UiValidationResult {
    const walk: Walk = { errors: [], nodes: 0, stateKeys: new Set() };
    if (!isPlainObject(spec)) {
        return { ok: false, errors: [{ path: '$', message: 'expected an object' }] };
    }
    if (typeof spec.id !== 'string' || spec.id === '') {
        walk.errors.push({ path: '$.id', message: 'expected a non-empty string' });
    }
    for (const key of ['title', 'badge'] as const) {
        if (spec[key] !== undefined && typeof spec[key] !== 'string') {
            walk.errors.push({ path: `$.${key}`, message: 'expected a string' });
        }
    }
    if (spec.size !== undefined) {
        const size = spec.size;
        if (!isPlainObject(size) || typeof size.w !== 'number' || typeof size.h !== 'number') {
            walk.errors.push({ path: '$.size', message: 'expected { "w": number, "h": number }' });
        }
    }
    if (spec.state !== undefined) {
        if (!isPlainObject(spec.state)) {
            walk.errors.push({ path: '$.state', message: 'expected an object' });
        } else {
            for (const key of Object.keys(spec.state)) walk.stateKeys.add(key);
        }
    }
    checkNode(spec.root, '$.root', walk, 0);
    return { ok: walk.errors.length === 0, errors: walk.errors };
}
