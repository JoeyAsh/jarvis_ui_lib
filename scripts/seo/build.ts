/**
 * Builds the static HTML of every docs route for search engines: one file per page with its own
 * title, description, canonical link and Open Graph tags, its content prerendered from the page's
 * Markdown, plus `sitemap.xml`. The SPA mounts over the prerendered content, so readers see the
 * same site as before. Pure: all inputs are passed in, so the docs plugin and the tests share it.
 */
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { DocsGroup, DocsPage } from '../../docs/src/nav.types';
import { pageTitle } from '../../docs/src/utils/pageTitle';

export interface SeoPage extends DocsPage {
    /** Meta description; empty falls back to the site description of the template. */
    description: string;
    /** Page content as Markdown; links to `<baseUrl>/<route>.md` become route links. */
    markdown: string;
}

export interface SeoInput {
    /** Absolute docs URL without trailing slash. */
    baseUrl: string;
    /** Site path with leading and trailing slash, e.g. `/jarvis_ui_lib/`. */
    base: string;
    /** Built `index.html` of the SPA. */
    template: string;
    pages: SeoPage[];
    groupOrder: DocsGroup[];
}

const ROOT_MARKER = '<div id="docs-root"></div>';
const DESCRIPTION_RE = /<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/;
const TITLE_RE = /<title>[^<]*<\/title>/;

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Output file of a route: `index.html` for the landing page, else `<slug>.html`. */
export function pageFile(slug: string): string {
    return slug === '' ? 'index.html' : `${slug}.html`;
}

/** Canonical URL of a route. */
export function pageUrl(baseUrl: string, slug: string): string {
    return slug === '' ? `${baseUrl}/` : `${baseUrl}/${slug}`;
}

/** Points links to the Markdown version of a page (`<baseUrl>/x.md`) at the page itself. */
export function routeLinks(markdown: string, baseUrl: string): string {
    const re = new RegExp(`${escapeRegExp(baseUrl)}/([^)\\s#]*?)\\.md(?=[)#\\s])`, 'g');
    return markdown.replace(re, (_m, path: string) =>
        pageUrl(baseUrl, path === 'index' ? '' : path),
    );
}

/** Markdown to HTML; raw HTML in the Markdown is dropped. */
export function markdownToHtml(markdown: string): string {
    return String(
        unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeStringify)
            .processSync(markdown),
    );
}

/** Links to every page, grouped like the sidebar, so crawlers find all routes without JS. */
function navHtml(input: SeoInput): string {
    const groups: (DocsGroup | undefined)[] = [undefined, ...input.groupOrder];
    const sections = groups.flatMap((group) => {
        const links = input.pages
            .filter((p) => p.group === group)
            .map((p) => `<li><a href="${input.base}${p.slug}">${escapeHtml(p.title)}</a></li>`);
        if (links.length === 0) return [];
        const heading = group === undefined ? '' : `<h2>${escapeHtml(group)}</h2>`;
        return [`${heading}<ul>${links.join('')}</ul>`];
    });
    return `<nav aria-label="Documentation">${sections.join('')}</nav>`;
}

function replaceOnce(html: string, search: RegExp | string, replacement: string): string {
    const found = typeof search === 'string' ? html.includes(search) : search.test(html);
    if (!found) throw new Error(`static pages: ${String(search)} not found in index.html`);
    return html.replace(search, () => replacement);
}

/** HTML of one route: the SPA template with the page's head tags and prerendered content. */
export function renderPage(input: SeoInput, page: SeoPage): string {
    const fallback = DESCRIPTION_RE.exec(input.template)?.[1] ?? '';
    const description = page.description === '' ? fallback : escapeHtml(page.description);
    const title = escapeHtml(pageTitle(page));
    const url = pageUrl(input.baseUrl, page.slug);
    const head = [
        `<link rel="canonical" href="${url}" />`,
        '<meta property="og:type" content="website" />',
        '<meta property="og:site_name" content="jarvis-react-ui" />',
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:url" content="${url}" />`,
        '<meta name="twitter:card" content="summary" />',
    ].join('\n        ');
    const content = markdownToHtml(routeLinks(page.markdown, input.baseUrl));

    let html = replaceOnce(input.template, TITLE_RE, `<title>${title}</title>`);
    html = replaceOnce(
        html,
        DESCRIPTION_RE,
        `<meta name="description" content="${description}" />`,
    );
    html = replaceOnce(html, '</head>', `    ${head}\n    </head>`);
    return replaceOnce(
        html,
        ROOT_MARKER,
        `<div id="docs-root"><div class="docs-prerender"><main>${content}</main>${navHtml(input)}</div></div>`,
    );
}

/** `404.html`, which GitHub Pages serves for unknown paths: the SPA, kept out of the index. */
export function renderNotFound(template: string): string {
    return replaceOnce(
        template,
        '</head>',
        '    <meta name="robots" content="noindex" />\n    </head>',
    );
}

export function buildSitemap(baseUrl: string, slugs: string[]): string {
    const urls = slugs.map((slug) => `  <url><loc>${pageUrl(baseUrl, slug)}</loc></url>`);
    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n');
}

/** Every file to emit, keyed by path below the site root. */
export function buildStaticPages(input: SeoInput): Map<string, string> {
    const files = new Map<string, string>();
    for (const page of input.pages) files.set(pageFile(page.slug), renderPage(input, page));
    files.set('404.html', renderNotFound(input.template));
    files.set(
        'sitemap.xml',
        buildSitemap(
            input.baseUrl,
            input.pages.map((p) => p.slug),
        ),
    );
    return files;
}
