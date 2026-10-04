import { describe, expect, it } from 'vitest';
import type { ApiDoc } from '../../../docs/src/api.types';
import { listPublicComponents } from '../../publicApi';
import { buildLlms } from '../build';
import { loadLlmsInput } from '../load';
import { apiTable, leadText, pageToMarkdown } from '../render';
import type { RenderContext } from '../render';

const BASE = 'https://example.test/docs';

const BUTTON: ApiDoc = {
    name: 'Button',
    slug: 'button',
    group: 'primitives',
    entry: 'jarvis-react-ui',
    file: 'src/ui/primitives/Button/Button.tsx',
    description: '',
    props: [
        {
            name: 'variant',
            type: "'primary' | 'ghost'",
            required: false,
            default: "'primary'",
            description: 'Visual emphasis.',
        },
    ],
    inherited: [{ from: 'ButtonHTMLAttributes', count: 10 }],
    types: [
        {
            name: 'ButtonItem',
            description: 'One entry.',
            definition: null,
            fields: [
                { name: 'id', type: 'string', required: true, default: null, description: 'Id.' },
            ],
        },
        { name: 'ButtonTone', description: '', definition: "'a' | 'b'", fields: [] },
    ],
};

const ctx: RenderContext = {
    baseUrl: BASE,
    api: (name) => (name === 'Button' ? BUTTON : undefined),
    demo: (name) =>
        name === 'button/Variants'
            ? 'export default function Variants() {\n    return <Button variant="ghost" />;\n}'
            : undefined,
    tokens: [{ name: 'Core palette', tokens: [{ name: '--bg', value: '#050508' }] }],
};

describe('pageToMarkdown', () => {
    const mdx = [
        "import { Landing } from '../components/Landing';",
        '',
        '# Button',
        '',
        '<Lead>',
        '    Buttons trigger an action. See [Usage](/getting-started/usage#props).',
        '</Lead>',
        '',
        '<ComponentMeta component="Button" />',
        '',
        '<Landing />',
        '',
        '<Demo name="button/Variants" align="start" />',
        '',
        '<Callout variant="warning" title="Careful">',
        '    Do not nest buttons.',
        '</Callout>',
        '',
        '```tsx',
        '<Demo name="kept/AsCode" />',
        '```',
        '',
        '<TokenTable />',
        '',
        '<ApiTable component="Button" />',
    ].join('\n');
    const md = pageToMarkdown(mdx, ctx);

    it('drops imports and unwraps the lead', () => {
        expect(md).not.toContain('import { Landing }');
        expect(md).not.toContain('<Lead>');
        expect(md).toContain('Buttons trigger an action.');
    });

    it('rewrites in-app links to absolute Markdown pages', () => {
        expect(md).toContain(`[Usage](${BASE}/getting-started/usage.md#props)`);
    });

    it('turns ComponentMeta into the import statement', () => {
        expect(md).toContain("```ts\nimport { Button } from 'jarvis-react-ui';\n```");
    });

    it('inlines demo source without touching its JSX', () => {
        expect(md).toContain('```tsx\nexport default function Variants()');
        expect(md).toContain('return <Button variant="ghost" />;');
    });

    it('removes interactive widgets and keeps fenced code unchanged', () => {
        expect(md).not.toContain('<Landing');
        expect(md).toContain('```tsx\n<Demo name="kept/AsCode" />\n```');
    });

    it('renders callouts as block quotes', () => {
        expect(md).toContain('> **Warning: Careful**\n>\n> Do not nest buttons.');
    });

    it('renders token and API tables', () => {
        expect(md).toContain('| `--bg` | `#050508` |  |');
        expect(md).toContain(
            "| `variant` | `'primary' \\| 'ghost'` | `'primary'` | Visual emphasis. |",
        );
        expect(md).toContain('`ButtonHTMLAttributes` (10)');
    });
});

describe('apiTable', () => {
    it('says so when a component has no own props', () => {
        expect(apiTable({ ...BUTTON, props: [], inherited: [], types: [] })).toBe('No own props.');
    });

    it('documents the helper types after the props', () => {
        const md = apiTable(BUTTON);
        expect(md).toContain(
            '### Type `ButtonItem`\n\nOne entry.\n\n| Field | Type | Default | Description |',
        );
        expect(md).toContain('| `id` (required) | `string` |  | Id. |');
        expect(md).toContain("```ts\ntype ButtonTone = 'a' | 'b';\n```");
    });
});

describe('leadText', () => {
    it('returns the lead as one plain line', () => {
        expect(leadText('<Lead>\n    A [link](/x) and\n    more.\n</Lead>')).toBe(
            'A link and more.',
        );
    });
});

describe('buildLlms on the real docs', () => {
    const api: ApiDoc[] = listPublicComponents().map((c) => ({
        ...c,
        description: '',
        props: [],
        inherited: [],
        types: [],
    }));
    const input = loadLlmsInput(api, BASE);
    const out = buildLlms(input);

    it('links every docs page except the changelog from llms.txt', () => {
        for (const page of input.pages) {
            const url = `${BASE}/${page.slug === '' ? 'index' : page.slug}.md`;
            if (page.slug === 'changelog') expect(out.index).not.toContain(url);
            else expect(out.index).toContain(`(${url})`);
        }
    });

    it('writes one Markdown file per page', () => {
        expect(out.pages.size).toBe(input.pages.length - 1);
        expect(out.pages.get('components/button.md')).toMatch(/^# Button\n/);
        expect(out.pages.get('index.md')).toMatch(/^# Overview\n/);
    });

    it('lists every public component with its demos in api.json', () => {
        expect(out.api.components.map((c) => c.name)).toEqual(api.map((c) => c.name));
        for (const component of out.api.components) {
            expect(component.demos.length).toBeGreaterThan(0);
        }
    });

    it('leaves no docs-only JSX outside of code blocks', () => {
        const prose = out.full.replace(/^```[^\n]*\n[\s\S]*?^```$/gm, '');
        expect(prose).not.toMatch(/<(Demo|ApiTable|ComponentMeta|Lead|TokenTable|Callout)\b/);
    });
});
