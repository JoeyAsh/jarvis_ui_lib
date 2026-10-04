/**
 * Builds the JSON Schema of generated-window specs (`UiWindowSpec`) from the allowlist
 * (`UI_REGISTRY`) and the API data (`buildApiDocs`): component and prop names come from the
 * registry, prop types and descriptions from the TypeScript types and JSDoc. A prop type the
 * mapping does not understand throws, so the schema cannot silently drift from the code.
 */
import type { ApiDoc, ApiProp, ApiType } from '../docs/src/api.types';
import { UI_ICONS } from '../src/ui/generative/icons';
import { UI_REGISTRY_META } from '../src/ui/generative/registry.meta';
import type { UiPropKind, UiRegistryMeta } from '../src/ui/generative/registry.types';

export type JsonSchema = { [key: string]: unknown };

const REF = (name: string): JsonSchema => ({ $ref: `#/$defs/${name}` });

/** Props a registry entry allows that come from native element attributes, not own props. */
const INHERITED: Record<string, { schema: JsonSchema; description: string }> = {
    disabled: { schema: { type: 'boolean' }, description: 'Disables the control.' },
    placeholder: { schema: { type: 'string' }, description: 'Hint text shown while empty.' },
    value: { schema: { type: 'string' }, description: 'Text value; bind it to edit state.' },
    type: {
        schema: { enum: ['text', 'email', 'number', 'password', 'search', 'url', 'tel'] },
        description: 'Input type.',
    },
    href: { schema: { type: 'string' }, description: 'Link target: an http(s) URL or a path.' },
    'aria-label': { schema: { type: 'string' }, description: 'Accessible name.' },
};

/** Props whose spec shape differs from the component type (adapted in the registry). */
const OVERRIDES: Record<string, Record<string, JsonSchema>> = {
    Table: {
        columns: {
            type: 'array',
            description: 'Columns; each cell shows `row[key]`.',
            items: {
                type: 'object',
                required: ['key', 'header'],
                additionalProperties: false,
                properties: {
                    key: { type: 'string', description: 'Field of each row shown in this column.' },
                    header: { type: 'string', description: 'Column title.' },
                    align: { enum: ['left', 'center', 'right'] },
                },
            },
        },
        rows: {
            type: 'array',
            description: 'Row objects; an `id` field keys the row.',
            items: { type: 'object' },
        },
    },
};

function splitTopLevel(text: string, separator: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < text.length; i++) {
        const ch = text[i] ?? '';
        if (ch === '<' || ch === '(' || ch === '{' || ch === '[') depth += 1;
        if (ch === '>' || ch === ')' || ch === '}' || ch === ']') depth -= 1;
        if (depth === 0 && text.startsWith(separator, i)) {
            parts.push(current.trim());
            current = '';
            i += separator.length - 1;
            continue;
        }
        current += ch;
    }
    parts.push(current.trim());
    return parts.filter((p) => p !== '');
}

interface MapContext {
    component: string;
    types: Map<string, ApiType>;
}

/** Literal values of a union, resolving named helper unions: `OrbState | 'working'`. */
function literalValues(
    text: string,
    ctx: MapContext,
    seen = new Set<string>(),
): (string | number)[] | null {
    const values: (string | number)[] = [];
    for (const part of splitTopLevel(text, '|')) {
        if (/^'[^']*'$/.test(part)) values.push(part.slice(1, -1));
        else if (/^-?\d+(\.\d+)?$/.test(part)) values.push(Number(part));
        else {
            const helper = ctx.types.get(part);
            if (helper?.definition == null || seen.has(part)) return null;
            seen.add(part);
            const nested = literalValues(helper.definition, ctx, seen);
            if (nested === null) return null;
            values.push(...nested);
        }
    }
    return values.length > 0 ? values : null;
}

/** JSON Schema of a TypeScript type text from the API data. */
function typeSchema(raw: string, ctx: MapContext): JsonSchema {
    const text = raw.replace(/\s+/g, ' ').trim();
    if (text === 'string') return { type: 'string' };
    if (text === 'number') return { type: 'number' };
    if (text === 'boolean') return { type: 'boolean' };
    if (text === 'ReactNode') return REF('content');
    if (/^(false \| )?LucideIcon( \| false)?$/.test(text)) return REF('icon');
    if (text.endsWith('[]') && !text.includes('|')) {
        return { type: 'array', items: typeSchema(text.slice(0, -2), ctx) };
    }
    const record = /^Partial<Record<(\w+), (\w+)>>$/.exec(text);
    if (record !== null) {
        const keys = literalValues(record[1] ?? '', ctx);
        const valueSchema = typeSchema(record[2] ?? '', ctx);
        return {
            type: 'object',
            additionalProperties: false,
            properties: Object.fromEntries((keys ?? []).map((k) => [String(k), valueSchema])),
        };
    }
    const literals = literalValues(text, ctx);
    if (literals !== null) return { enum: literals };
    const name = text.replace(/<.*>$/, '');
    const helper = ctx.types.get(name);
    if (helper !== undefined) {
        if (helper.definition !== null) return typeSchema(helper.definition, ctx);
        const fields = helper.fields.filter((f) => !f.type.includes('=>'));
        return {
            type: 'object',
            ...(helper.description !== '' ? { description: helper.description } : {}),
            additionalProperties: false,
            required: fields.filter((f) => f.required).map((f) => f.name),
            properties: Object.fromEntries(
                fields.map((f) => [
                    f.name,
                    withDescription(typeSchema(f.type, ctx), f.description),
                ]),
            ),
        };
    }
    throw new Error(`ui-schema: ${ctx.component}: cannot map type "${text}"`);
}

function withDescription(schema: JsonSchema, description: string): JsonSchema {
    return description === ''
        ? schema
        : { ...schema, description: description.replace(/\s+/g, ' ') };
}

function propSchema(
    component: string,
    name: string,
    kind: UiPropKind,
    apiProp: ApiProp | undefined,
    ctx: MapContext,
    bindable: boolean,
): JsonSchema {
    const override = OVERRIDES[component]?.[name];
    let base: JsonSchema;
    let description = apiProp?.description ?? INHERITED[name]?.description ?? '';
    if (override !== undefined) {
        base = override;
    } else if (kind === 'node') {
        base = REF('content');
    } else if (kind === 'icon') {
        base = REF('icon');
    } else if (kind === 'template') {
        base = { type: 'string' };
        description = `${description} Format template: "{value}" is replaced by the number, e.g. "{value} %".`;
    } else if (kind === 'url') {
        base = { type: 'string' };
        description = `${description} Only http(s) URLs or relative paths.`;
    } else if (apiProp !== undefined) {
        base = typeSchema(apiProp.type, ctx);
    } else {
        const inherited = INHERITED[name];
        if (inherited === undefined) {
            throw new Error(`ui-schema: ${component}.${name}: no type information`);
        }
        base = inherited.schema;
    }
    const variants: JsonSchema[] = [base, REF('stateRef')];
    if (bindable) variants.push(REF('binding'));
    return withDescription({ anyOf: variants }, description.trim());
}

function componentSchema(name: string, entry: UiRegistryMeta, doc: ApiDoc | undefined): JsonSchema {
    const ctx: MapContext = {
        component: name,
        types: new Map((doc?.types ?? []).map((t) => [t.name.replace(/<.*>$/, ''), t])),
    };
    const apiProps = new Map((doc?.props ?? []).map((p) => [p.name, p]));
    const props = Object.fromEntries(
        Object.entries(entry.props).map(([prop, kind]) => [
            prop,
            propSchema(name, prop, kind, apiProps.get(prop), ctx, entry.bind?.[prop] !== undefined),
        ]),
    );
    const properties: JsonSchema = {
        type: { const: name },
        id: { type: 'string', description: 'Id to address this node, e.g. a player for `call`.' },
        props: { type: 'object', additionalProperties: false, properties: props },
        visibleIf: REF('condition'),
    };
    if (entry.children === 'text') {
        properties.children = {
            anyOf: [{ type: 'string' }, { type: 'number' }],
            description: 'Text; may contain {{key}} templates.',
        };
    } else if (entry.children === 'nodes') {
        properties.children = {
            anyOf: [
                { type: 'string' },
                { type: 'array', items: { anyOf: [REF('node'), { type: 'string' }] } },
            ],
            description: 'Text or child nodes.',
        };
    }
    if (entry.events !== undefined) {
        properties.on = {
            type: 'object',
            additionalProperties: false,
            properties: Object.fromEntries(
                Object.keys(entry.events).map((e) => [e, REF('actions')]),
            ),
        };
    }
    return {
        type: 'object',
        ...(doc?.description ? { description: doc.description.replace(/\s+/g, ' ') } : {}),
        required: ['type'],
        additionalProperties: false,
        properties,
    };
}

/** The JSON Schema of a `UiWindowSpec`. */
export function buildUiSchema(apiDocs: ApiDoc[]): JsonSchema {
    const docs = new Map(apiDocs.map((d) => [d.name, d]));
    const components: [string, UiRegistryMeta][] = Object.entries(UI_REGISTRY_META);
    const defs: Record<string, JsonSchema> = {
        node: { anyOf: components.map(([name]) => REF(`component_${name}`)) },
        content: {
            description: 'Text (may contain {{key}} templates) or a node.',
            anyOf: [{ type: 'string' }, { type: 'number' }, REF('node')],
        },
        icon: { enum: Object.keys(UI_ICONS), description: 'Icon name.' },
        stateRef: {
            type: 'object',
            description: 'Reads a state value.',
            required: ['$state'],
            additionalProperties: false,
            properties: { $state: { type: 'string' } },
        },
        binding: {
            type: 'object',
            description:
                'Binds the prop to a state value in both directions; the key must be declared in "state".',
            required: ['$bind'],
            additionalProperties: false,
            properties: { $bind: { type: 'string' } },
        },
        action: {
            anyOf: [
                {
                    type: 'object',
                    description: 'Sets a state value; without "value" the event value is used.',
                    required: ['set'],
                    additionalProperties: false,
                    properties: { set: { type: 'string' }, value: {} },
                },
                {
                    type: 'object',
                    description: 'Flips a boolean state value.',
                    required: ['toggle'],
                    additionalProperties: false,
                    properties: { toggle: { type: 'string' } },
                },
                {
                    type: 'object',
                    description:
                        'Sends an event to the app; without "payload" the event value is sent.',
                    required: ['emit'],
                    additionalProperties: false,
                    properties: { emit: { type: 'string' }, payload: {} },
                },
            ],
        },
        actions: { anyOf: [REF('action'), { type: 'array', items: REF('action') }] },
        condition: {
            type: 'object',
            description:
                'Show the node only while state[state] is truthy, equals "eq" or differs from "ne".',
            required: ['state'],
            additionalProperties: false,
            properties: { state: { type: 'string' }, eq: {}, ne: {} },
        },
    };
    for (const [name, entry] of components) {
        defs[`component_${name}`] = componentSchema(name, entry, docs.get(name));
    }
    return {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: 'UiWindowSpec',
        description:
            'A window built from jarvis-react-ui components. Layout with Stack and Grid; bind form controls to "state" with {"$bind": key}; show state with {{key}} templates; use "on" actions to set state or emit events to the app.',
        type: 'object',
        required: ['id', 'root'],
        additionalProperties: false,
        properties: {
            id: {
                type: 'string',
                description: 'Unique window id; reusing an id replaces that window.',
            },
            title: { type: 'string', description: 'Window title.' },
            badge: { type: 'string', description: 'Short tag in the header, e.g. "LIVE".' },
            size: {
                type: 'object',
                description: 'Initial size in px.',
                required: ['w', 'h'],
                additionalProperties: false,
                properties: { w: { type: 'number' }, h: { type: 'number' } },
            },
            state: {
                type: 'object',
                description: 'Initial state values (JSON), e.g. {"volume": 40}.',
            },
            root: REF('node'),
        },
        $defs: defs,
    };
}

/** Tool definitions for the Claude API (`tools`), built around the spec schema. */
export function buildUiTools(schema: JsonSchema): JsonSchema[] {
    return [
        {
            name: 'open_window',
            description:
                'Opens a window built from UI components, or replaces the window with the same id. Use it to show the user controls, data, media or a web page.',
            input_schema: schema,
        },
        {
            name: 'update_window',
            description:
                'Changes state values of an open window without rebuilding it, e.g. {"id": "volume", "state": {"volume": 20}}.',
            input_schema: {
                type: 'object',
                required: ['id', 'state'],
                additionalProperties: false,
                properties: {
                    id: { type: 'string', description: 'Id of the open window.' },
                    state: { type: 'object', description: 'State values to merge in.' },
                },
            },
        },
        {
            name: 'control_player',
            description: 'Controls a media or YouTube player that has an "id" in an open window.',
            input_schema: {
                type: 'object',
                required: ['window_id', 'node_id', 'method'],
                additionalProperties: false,
                properties: {
                    window_id: { type: 'string' },
                    node_id: { type: 'string' },
                    method: { enum: ['play', 'pause', 'seek', 'setVolume', 'setMuted'] },
                    value: {
                        description:
                            'Seconds for seek, 0–1 for setVolume, true/false for setMuted.',
                        anyOf: [{ type: 'number' }, { type: 'boolean' }],
                    },
                },
            },
        },
        {
            name: 'close_window',
            description: 'Closes an open window.',
            input_schema: {
                type: 'object',
                required: ['id'],
                additionalProperties: false,
                properties: { id: { type: 'string' } },
            },
        },
    ];
}
