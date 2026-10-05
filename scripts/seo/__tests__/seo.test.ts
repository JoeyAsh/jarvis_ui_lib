import { describe, expect, it } from 'vitest';
import {
    buildSitemap,
    buildStaticPages,
    markdownToHtml,
    pageFile,
    pageUrl,
    renderPage,
    routeLinks,
} from '../build';
import type { SeoInput } from '../build';

const BASE_URL = 'https://example.test/docs';

const TEMPLATE = `<!doctype html>
<html lang="en">
    <head>
        <meta name="description" content="Site description." />
        <title>jarvis-react-ui</title>
    </head>
    <body>
        <div id="docs-root"></div>
    </body>
</html>`;

const INPUT: SeoInput = {
    baseUrl: BASE_URL,
    base: '/docs/',
    template: TEMPLATE,
    groupOrder: ['Primitives'],
    pages: [
        { slug: '', title: 'Overview', description: '', markdown: '# Overview\n\nHello.' },
        {
            slug: 'components/button',
            title: 'Button',
            group: 'Primitives',
            description: 'Buttons trigger an action <fast> & "loud".',
            markdown: `# Button\n\nSee [Pill](${BASE_URL}/components/pill.md#api).`,
        },
    ],
};

describe('pageFile / pageUrl', () => {
    it('maps the landing page to index.html and the site root', () => {
        expect(pageFile('')).toBe('index.html');
        expect(pageUrl(BASE_URL, '')).toBe(`${BASE_URL}/`);
    });

    it('maps a route to an extensionless URL served from <slug>.html', () => {
        expect(pageFile('components/button')).toBe('components/button.html');
        expect(pageUrl(BASE_URL, 'components/button')).toBe(`${BASE_URL}/components/button`);
    });
});

describe('routeLinks', () => {
    it('points Markdown page links at the routes and keeps other links', () => {
        const md = `[a](${BASE_URL}/components/pill.md#api) [b](${BASE_URL}/index.md) [c](${BASE_URL}/llms-full.txt)`;
        expect(routeLinks(md, BASE_URL)).toBe(
            `[a](${BASE_URL}/components/pill#api) [b](${BASE_URL}/) [c](${BASE_URL}/llms-full.txt)`,
        );
    });
});

describe('markdownToHtml', () => {
    it('renders GFM tables and drops raw HTML', () => {
        const html = markdownToHtml('| a |\n| - |\n| b |\n\n<script>x()</script>');
        expect(html).toContain('<table>');
        expect(html).not.toContain('<script>');
    });
});

describe('renderPage', () => {
    const [landing, button] = INPUT.pages;

    it('writes title, escaped description, canonical and Open Graph tags', () => {
        if (button === undefined) throw new Error('fixture');
        const html = renderPage(INPUT, button);
        expect(html).toContain('<title>Button · jarvis-react-ui</title>');
        const description = 'Buttons trigger an action &lt;fast&gt; &amp; &quot;loud&quot;.';
        expect(html).toContain(`<meta name="description" content="${description}" />`);
        expect(html).toContain(`<link rel="canonical" href="${BASE_URL}/components/button" />`);
        expect(html).toContain(`<meta property="og:description" content="${description}" />`);
    });

    it('prerenders the content and links every page', () => {
        if (button === undefined) throw new Error('fixture');
        const html = renderPage(INPUT, button);
        expect(html).toContain('<h1>Button</h1>');
        expect(html).toContain(`<a href="${BASE_URL}/components/pill#api">Pill</a>`);
        expect(html).toContain('<a href="/docs/">Overview</a>');
        expect(html).toContain('<h2>Primitives</h2><ul><li><a href="/docs/components/button">');
    });

    it('falls back to the site description and title on the landing page', () => {
        if (landing === undefined) throw new Error('fixture');
        const html = renderPage(INPUT, landing);
        expect(html).toContain('<title>jarvis-react-ui · HUD components for React</title>');
        expect(html).toContain('<meta name="description" content="Site description." />');
    });

    it('fails loudly when the template lost a marker', () => {
        if (landing === undefined) throw new Error('fixture');
        expect(() => renderPage({ ...INPUT, template: '<html></html>' }, landing)).toThrow();
    });
});

describe('buildStaticPages', () => {
    it('emits every page, a noindex 404 fallback and the sitemap', () => {
        const files = buildStaticPages(INPUT);
        expect([...files.keys()]).toEqual([
            'index.html',
            'components/button.html',
            '404.html',
            'sitemap.xml',
        ]);
        expect(files.get('404.html')).toContain('<meta name="robots" content="noindex" />');
        expect(files.get('404.html')).toContain('<div id="docs-root"></div>');
    });

    it('lists every route in the sitemap', () => {
        expect(buildSitemap(BASE_URL, ['', 'components/button'])).toContain(
            `<url><loc>${BASE_URL}/</loc></url>\n  <url><loc>${BASE_URL}/components/button</loc></url>`,
        );
    });
});
