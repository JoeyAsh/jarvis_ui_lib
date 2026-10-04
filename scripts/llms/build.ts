/**
 * Builds the language-model files of the docs: `llms.txt` (index with usage rules and links),
 * `llms-full.txt` (every page as Markdown), one Markdown file per page and `api.json`
 * (machine-readable API of every public component with its demo sources). Pure: all inputs are
 * passed in, so the docs site plugin, the package build and the tests share it.
 */
import type { ApiDoc } from '../../docs/src/api.types';
import type { DocsGroup, DocsPage } from '../../docs/src/nav.types';
import type { TokenGroup } from '../../docs/src/utils/tokens.types';
import { leadText, pageToMarkdown } from './render';
import type { RenderContext } from './render';

export interface LlmsPage extends DocsPage {
    /** MDX source of the page. */
    mdx: string;
}

export interface LlmsInput {
    /** Absolute docs URL without trailing slash. */
    baseUrl: string;
    /** Package version the files describe. */
    version: string;
    /** Docs pages in sidebar order. */
    pages: LlmsPage[];
    groupOrder: DocsGroup[];
    api: ApiDoc[];
    /** Demo sources by name below `docs/src/demos/`, e.g. `button/Variants`. */
    demos: Map<string, string>;
    tokens: TokenGroup[];
}

export interface LlmsComponent extends ApiDoc {
    /** Markdown docs page of the component. */
    docsUrl: string;
    /** Demos shown on the docs page, in page order. */
    demos: { name: string; code: string }[];
}

export interface LlmsApi {
    name: 'jarvis-react-ui';
    version: string;
    docsUrl: string;
    components: LlmsComponent[];
}

export interface LlmsOutput {
    /** `llms.txt` */
    index: string;
    /** `llms-full.txt` */
    full: string;
    /** Markdown per page, keyed by output path (`components/button.md`, `index.md`). */
    pages: Map<string, string>;
    /** `api.json` */
    api: LlmsApi;
}

/** Pages left out of the Markdown output (rendered from other sources on the site). */
const SKIPPED = new Set(['changelog']);

const SUMMARY =
    'Sharp, dark, HUD-style React 19 component library (JARVIS look: JetBrains Mono, glow instead of shadows): primitives, inputs, dialogs, toasts, tables, charts, a window/slot-grid system, a CSS and a Three.js orb, and built-in UI sound effects.';

const USAGE_RULES = `## Usage rules

- Install \`jarvis-react-ui\` with its peers \`react\` and \`react-dom\` (^19) and \`lucide-react\`. \`three\` is an optional peer, needed only for \`ThreeOrb\`.
- Import the stylesheet once at the app root: \`import 'jarvis-react-ui/style.css';\`. Tailwind is not required in the consuming project.
- Import components, hooks and types from the package root only: \`import { Button, Panel } from 'jarvis-react-ui';\`. Never deep-import from \`jarvis-react-ui/dist/...\`.
- \`ThreeOrb\`, \`createOrb\` and \`OrbEngine\` come from \`jarvis-react-ui/orb\` (separate entry so \`three\` stays out of the main bundle). \`CssOrb\` is in the main entry.
- Wrap the app once in \`JarvisProvider\` (UI sounds, toasts, \`useJarvis()\`). \`useToast()\` and \`useJarvis()\` throw outside of it; without a provider the other components work but stay silent.
- Give the page the dark surface: \`body { background: var(--bg); color: var(--text); }\`. Style with the design tokens (\`var(--accent)\`, ...), not hard-coded colors.
- Every component accepts \`className\`; components wrapping a native element accept its attributes and forward \`ref\`.
- Layout: use \`Stack\` (rows/columns) and \`Grid\` (columns) with token gaps (\`xs\`–\`xl\`); sizes via the project's own CSS classes, or Tailwind only if the project has Tailwind. The demos below use Tailwind utilities (\`flex gap-3\`, \`w-[280px]\`) for layout; without Tailwind, replace them with \`Stack\`, \`Grid\` or own CSS. Do not rely on utility classes from \`style.css\`: it contains only an internal subset that changes between releases.
- Use only the props listed in the API tables; do not invent props or variants. Helper types used by props (e.g. \`TabItem\`, \`TableColumn<T>\`) are documented under "Type" after each API table.`;

function pagePath(slug: string): string {
    return `${slug === '' ? 'index' : slug}.md`;
}

function withTitle(markdown: string, title: string): string {
    return markdown.startsWith('# ') ? markdown : `# ${title}\n\n${markdown}`;
}

function demoNames(mdx: string): string[] {
    return [...mdx.matchAll(/<Demo\b[^>]*\bname="([^"]+)"/g)].map((m) => m[1] ?? '');
}

export function buildLlms(input: LlmsInput): LlmsOutput {
    const { baseUrl, version } = input;
    const apiByName = new Map(input.api.map((doc) => [doc.name, doc]));
    const ctx: RenderContext = {
        baseUrl,
        api: (name) => apiByName.get(name),
        demo: (name) => input.demos.get(name),
        tokens: input.tokens,
    };

    const pages = input.pages.filter((p) => !SKIPPED.has(p.slug));
    const markdown = new Map<string, string>();
    for (const page of pages) {
        markdown.set(pagePath(page.slug), withTitle(pageToMarkdown(page.mdx, ctx), page.title));
    }

    const header = `# jarvis-react-ui\n\n> ${SUMMARY}\n\nVersion ${version}. Docs: ${baseUrl}/`;

    const sections: string[] = [];
    const groups: (DocsGroup | undefined)[] = [undefined, ...input.groupOrder];
    for (const group of groups) {
        const entries = pages
            .filter((p) => p.group === group)
            .map((p) => {
                const lead = leadText(p.mdx);
                const link = `- [${p.title}](${baseUrl}/${pagePath(p.slug)})`;
                return lead === '' ? link : `${link}: ${lead}`;
            });
        if (entries.length > 0) sections.push(`## ${group ?? 'Overview'}\n\n${entries.join('\n')}`);
    }
    sections.push(
        `## Optional\n\n- [Full documentation in one file](${baseUrl}/llms-full.txt): every page above with demo code and API tables.\n- [Changelog](${baseUrl}/changelog)`,
    );

    const index = `${[header, USAGE_RULES, ...sections].join('\n\n')}\n`;
    const full = `${[header, USAGE_RULES, ...markdown.values()]
        .join('\n\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd()}\n`;

    const components: LlmsComponent[] = input.api.map((doc) => {
        const slug = `components/${doc.slug}`;
        const mdx = input.pages.find((p) => p.slug === slug)?.mdx ?? '';
        return {
            ...doc,
            docsUrl: `${baseUrl}/${pagePath(slug)}`,
            demos: demoNames(mdx).flatMap((name) => {
                const code = input.demos.get(name);
                return code === undefined ? [] : [{ name, code }];
            }),
        };
    });

    return {
        index,
        full,
        pages: markdown,
        api: { name: 'jarvis-react-ui', version, docsUrl: `${baseUrl}/`, components },
    };
}
