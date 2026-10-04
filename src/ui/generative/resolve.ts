import type {
    UiBinding,
    UiCondition,
    UiJson,
    UiNode,
    UiState,
    UiStateRef,
    UiValue,
} from './spec.types';
import type { UiJsonObject } from './registry.types';

/** Whether `value` is a plain JSON object (not an array, not null). */
export function isPlainObject(value: unknown): value is UiJsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** `{ "$state": "key" }` */
export function isStateRef(value: unknown): value is UiStateRef {
    return isPlainObject(value) && typeof value.$state === 'string';
}

/** `{ "$bind": "key" }` */
export function isBinding(value: unknown): value is UiBinding {
    return isPlainObject(value) && typeof value.$bind === 'string';
}

/** A spec node: an object with a string `type`. */
export function isNode(value: unknown): value is UiNode {
    return isPlainObject(value) && typeof value.type === 'string';
}

/** Text of a state value for templates: `''` for missing values, JSON for objects. */
function templateText(value: UiJson | undefined): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

/** Replaces `{{key}}` with state values: `"Volume {{volume}} %"` → `"Volume 40 %"`. */
export function interpolate(text: string, state: UiState): string {
    return text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_m, key: string) => templateText(state[key]));
}

/**
 * Resolves a spec value against the state: state reads and bindings become the state value,
 * strings get their templates filled in, arrays and objects are resolved deeply.
 */
export function resolveValue(value: UiValue | undefined, state: UiState): UiJson | undefined {
    if (value === undefined) return undefined;
    if (isStateRef(value)) return state[value.$state];
    if (isBinding(value)) return state[value.$bind];
    if (typeof value === 'string') return interpolate(value, state);
    if (Array.isArray(value)) return value.map((v) => resolveValue(v, state) ?? null);
    if (isPlainObject(value)) {
        const out: UiJsonObject = {};
        for (const [k, v] of Object.entries(value)) {
            const resolved = resolveValue(v, state);
            if (resolved !== undefined) out[k] = resolved;
        }
        return out;
    }
    return value;
}

/** JSON equality for conditions. */
function same(a: UiJson | undefined, b: UiJson | undefined): boolean {
    return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/** Whether a `visibleIf` condition holds for the state. */
export function evaluateCondition(condition: UiCondition, state: UiState): boolean {
    const value = state[condition.state];
    if (condition.eq !== undefined) return same(value, condition.eq);
    if (condition.ne !== undefined) return !same(value, condition.ne);
    return Boolean(value) && !(Array.isArray(value) && value.length === 0);
}

/** Turns a format template into a formatter: `"{value} %"` → `(v) => "40 %"`. */
export function formatter(template: string): (value: number) => string {
    return (value) => template.replace(/\{value\}/g, String(value));
}

/** Converts an event value from a component callback into JSON, or `undefined`. */
export function toJson(value: unknown): UiJson | undefined {
    if (
        value === null ||
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        return value;
    }
    return undefined;
}

/** Whether a URL may be used: `http(s)`, protocol-relative is not allowed, relative paths are. */
export function isSafeUrl(url: string): boolean {
    if (/^https?:\/\//i.test(url)) return true;
    return !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('//');
}

/** The value an event passes to actions, per the registry's event kind. */
export function eventValue(
    kind: 'none' | 'arg' | 'target-value' | 'target-checked',
    args: readonly unknown[],
): UiJson | undefined {
    if (kind === 'none') return undefined;
    const first = args[0];
    if (kind === 'arg') return toJson(first);
    const target =
        typeof first === 'object' && first !== null && 'target' in first ? first.target : null;
    if (typeof target !== 'object' || target === null) return undefined;
    if (kind === 'target-value') return 'value' in target ? toJson(target.value) : undefined;
    return 'checked' in target ? toJson(target.checked) : undefined;
}
