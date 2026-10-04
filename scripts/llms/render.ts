/**
 * Turns a docs MDX page into plain Markdown for language models: docs-only JSX is replaced by
 * what it shows on the site (demo source, API table, import statement, token table), purely
 * interactive widgets are dropped and in-app links become absolute links to the Markdown pages.
 */
import type { ApiDoc } from '../../docs/src/api.types';
import type { TokenGroup } from '../../docs/src/utils/tokens.types';

export interface RenderContext {
    /** Absolute docs URL without trailing slash, e.g. `https://joeyash.github.io/jarvis_ui_lib`. */
    baseUrl: string;
    /** API data of a public component by export name. */
    api: (name: string) => ApiDoc | undefined;
    /** Source of a demo by name below `docs/src/demos/`, e.g. `button/Variants`. */
    demo: (name: string) => string | undefined;
    /** Design tokens parsed from `src/styles/tokens.css`. */
    tokens: TokenGroup[];
}

const FENCE_RE = /^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;

/** Value of a string attribute in a JSX tag, e.g. `attr('<Demo name="a/B" />', 'name')`. */
function attr(tag: string, name: string): string | undefined {
    return new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
}

/** Escapes a value for a Markdown table cell. */
function cell(text: string): string {
    return text.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ');
}

/** Re-joins an indented JSX body into Markdown paragraphs. */
function unindent(body: string): string {
    return body
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim();
}

function codeBlock(language: string, code: string): string {
    return `\`\`\`${language}\n${code.replace(/\r\n/g, '\n').trimEnd()}\n\`\`\``;
}

/** The generated API table of a component as a Markdown table. */
export function apiTable(doc: ApiDoc): string {
    const rows = doc.props.map((p) => {
        const name = p.required ? `\`${p.name}\` (required)` : `\`${p.name}\``;
        const def = p.default === null ? '' : `\`${cell(p.default)}\``;
        return `| ${name} | \`${cell(p.type)}\` | ${def} | ${cell(p.description)} |`;
    });
    const lines =
        rows.length === 0
            ? ['No own props.']
            : ['| Prop | Type | Default | Description |', '| --- | --- | --- | --- |', ...rows];
    if (doc.inherited.length > 0) {
        const from = doc.inherited.map((i) => `\`${i.from}\` (${i.count})`).join(', ');
        lines.push('', `Also accepts inherited props from ${from}.`);
    }
    return lines.join('\n');
}

function tokenTables(groups: TokenGroup[]): string {
    return groups
        .map((g) => {
            const rows = g.tokens.map(
                (t) => `| \`${t.name}\` | \`${cell(t.value)}\` | ${cell(t.note ?? '')} |`,
            );
            return [
                `### ${g.name}`,
                '',
                '| Token | Value | Note |',
                '| --- | --- | --- |',
                ...rows,
            ].join('\n');
        })
        .join('\n\n');
}

/** Rewrites in-app links (`/components/x#api`) to absolute Markdown page links. */
function absoluteLinks(text: string, baseUrl: string): string {
    return text.replace(
        /\]\((\/(?!\/)[^)#\s]*)(#[^)\s]*)?\)/g,
        (_m, path: string, hash?: string) => {
            const slug = path.replace(/^\/+|\/+$/g, '');
            const target = /\.[a-z]+$/i.test(slug) ? slug : `${slug === '' ? 'index' : slug}.md`;
            return `](${baseUrl}/${target}${hash ?? ''})`;
        },
    );
}

function renderProse(text: string, ctx: RenderContext): string {
    // Generated blocks (demo source, tables) are parked as placeholders so the tag clean-up below
    // never touches the JSX inside demo code.
    const blocks: string[] = [];
    const park = (block: string): string => {
        blocks.push(block);
        return `@@llms-block-${blocks.length - 1}@@`;
    };

    const prose = absoluteLinks(
        text
            .replace(/^import\s.*$/gm, '')
            .replace(/<Lead>([\s\S]*?)<\/Lead>/g, (_m, body: string) => unindent(body))
            .replace(
                /<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g,
                (_m, attrs: string, body: string) => {
                    const title = attr(attrs, 'title');
                    const warning = attr(attrs, 'variant') === 'warning';
                    const heading = `${warning ? 'Warning' : 'Note'}${title === undefined ? '' : `: ${title}`}`;
                    const quoted = unindent(body)
                        .split('\n')
                        .map((line) => (line === '' ? '>' : `> ${line}`));
                    return [`> **${heading}**`, '>', ...quoted].join('\n');
                },
            )
            .replace(/<ComponentMeta\b[^>]*\/>/g, (tag) => {
                const doc = ctx.api(attr(tag, 'component') ?? '');
                return doc === undefined
                    ? ''
                    : park(codeBlock('ts', `import { ${doc.name} } from '${doc.entry}';`));
            })
            .replace(/<Demo\b[^>]*\/>/g, (tag) => {
                const source = ctx.demo(attr(tag, 'name') ?? '');
                return source === undefined ? '' : park(codeBlock('tsx', source));
            })
            .replace(/<ApiTable\b[^>]*\/>/g, (tag) => {
                const doc = ctx.api(attr(tag, 'component') ?? '');
                return doc === undefined ? '' : park(apiTable(doc));
            })
            .replace(/<TokenTable\b[^>]*\/>/g, (tag) => {
                const group = attr(tag, 'group');
                return park(
                    tokenTables(
                        group === undefined
                            ? ctx.tokens
                            : ctx.tokens.filter((g) => g.name === group),
                    ),
                );
            })
            // Interactive widgets (Landing, ThemePlayground, ...) have no text equivalent.
            .replace(/^[ \t]*<[A-Z][A-Za-z]*\b[^>]*\/>[ \t]*$/gm, '')
            // Any other docs wrapper: keep its content.
            .replace(/^[ \t]*<\/?[A-Z][A-Za-z]*\b[^>]*>[ \t]*$/gm, ''),
        ctx.baseUrl,
    );
    return prose.replace(/@@llms-block-(\d+)@@/g, (_m, i: string) => blocks[Number(i)] ?? '');
}

/** Markdown version of one MDX page. Fenced code blocks are passed through unchanged. */
export function pageToMarkdown(mdx: string, ctx: RenderContext): string {
    const source = mdx.replace(/\r\n/g, '\n');
    const parts: string[] = [];
    let last = 0;
    for (const match of source.matchAll(FENCE_RE)) {
        parts.push(renderProse(source.slice(last, match.index), ctx), match[0]);
        last = match.index + match[0].length;
    }
    parts.push(renderProse(source.slice(last), ctx));
    return `${parts
        .join('')
        .replace(/\n{3,}/g, '\n\n')
        .trim()}\n`;
}

/** Plain text of a page's `<Lead>`, used as its one-line summary in llms.txt. */
export function leadText(mdx: string): string {
    const body = /<Lead>([\s\S]*?)<\/Lead>/.exec(mdx)?.[1] ?? '';
    return body
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}
