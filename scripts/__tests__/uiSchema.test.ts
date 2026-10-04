import { describe, it, expect } from 'vitest';
import Ajv2020 from 'ajv/dist/2020';
import { buildApiDocs } from '../apiDocs';
import { buildUiSchema, buildUiTools } from '../uiSchema';
import { UI_REGISTRY_META } from '../../src/ui/generative/registry.meta';
import { validateUiSpec } from '../../src/ui/generative/validate';
import { DEMO_SPEC } from '../../src/ui/showcase/sections/GenerativeSection.constants';

const schema = buildUiSchema(buildApiDocs());
const ajv = new Ajv2020({ strict: false, allErrors: true });
const validate = ajv.compile(schema);

function accepts(spec: unknown): boolean {
    return validate(spec);
}

const VIDEO_AND_WEB = {
    id: 'media',
    title: 'Media',
    size: { w: 480, h: 360 },
    state: { tab: 'video' },
    root: {
        type: 'Tabs',
        props: {
            'aria-label': 'Sources',
            value: { $bind: 'tab' },
            items: [
                {
                    value: 'video',
                    label: 'Video',
                    content: {
                        type: 'YouTubePlayer',
                        id: 'player',
                        props: { videoId: 'aqz-KE-bpKQ' },
                    },
                },
                {
                    value: 'web',
                    label: 'Web',
                    content: {
                        type: 'WebFrame',
                        props: { url: 'https://example.com', height: 240 },
                    },
                },
            ],
        },
    },
};

const DASHBOARD = {
    id: 'dash',
    state: { scan: true },
    root: {
        type: 'Grid',
        props: { columns: 2, gap: 'sm' },
        children: [
            { type: 'Metric', props: { value: 87, unit: '%' } },
            { type: 'Pill', props: { variant: 'ok' }, children: 'online' },
            {
                type: 'LineChart',
                props: {
                    'aria-label': 'Load',
                    labels: ['a', 'b'],
                    series: [{ id: 'cpu', label: 'CPU', data: [1, 2], color: 'accent' }],
                    formatValue: '{value} %',
                },
            },
            {
                type: 'Table',
                props: {
                    columns: [{ key: 'name', header: 'Name' }],
                    rows: [{ id: 1, name: 'Radar' }],
                },
            },
            {
                type: 'Checkbox',
                props: { label: 'Scan', checked: { $bind: 'scan' } },
                on: { onCheckedChange: { emit: 'scan_changed' } },
            },
            { type: 'IconButton', props: { icon: 'RefreshCw', label: 'Refresh' } },
            { type: 'StatusLabel', props: { state: 'working', labels: { working: 'arbeitet …' } } },
        ],
    },
};

describe('ui schema', () => {
    it('covers every registry component', () => {
        const defs = schema.$defs as Record<string, unknown>;
        for (const name of Object.keys(UI_REGISTRY_META)) {
            expect(defs[`component_${name}`]).toBeDefined();
        }
    });

    it('accepts real specs that validateUiSpec accepts too', () => {
        for (const spec of [DEMO_SPEC, VIDEO_AND_WEB, DASHBOARD]) {
            expect(accepts(spec), JSON.stringify(validate.errors?.slice(0, 3))).toBe(true);
            expect(validateUiSpec(spec).ok).toBe(true);
        }
    });

    it('rejects unknown components, props, values and actions', () => {
        const bad = [
            { id: 'x', root: { type: 'ThreeOrb' } },
            { id: 'x', root: { type: 'Button', props: { className: 'x' }, children: 'a' } },
            { id: 'x', root: { type: 'Button', props: { variant: 'rainbow' }, children: 'a' } },
            { id: 'x', root: { type: 'Button', on: { onClick: { go: 'x' } }, children: 'a' } },
            { id: 'x', root: { type: 'IconButton', props: { icon: 'Nope', label: 'x' } } },
            { id: 'x', root: { type: 'CodeBlock', props: { code: 'x', html: '<b>' } } },
            { root: { type: 'Pill', children: 'missing id' } },
        ];
        for (const spec of bad) expect(accepts(spec)).toBe(false);
    });

    it('builds Claude tool definitions around the schema', () => {
        const tools = buildUiTools(schema);
        expect(tools.map((t) => t.name)).toEqual([
            'open_window',
            'update_window',
            'control_player',
            'close_window',
        ]);
        expect(tools[0]?.input_schema).toBe(schema);
        for (const tool of tools)
            expect(ajv.compile(tool.input_schema as object)).toBeTypeOf('function');
    });
});
