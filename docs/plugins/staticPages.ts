import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { buildLlms } from '../../scripts/llms/build.ts';
import { DOCS_URL, loadLlmsInput } from '../../scripts/llms/load.ts';
import { leadText } from '../../scripts/llms/render.ts';
import { buildStaticPages } from '../../scripts/seo/build.ts';
import { readApi } from './llmsTxt.ts';

const CHANGELOG = join(import.meta.dirname, '../../CHANGELOG.md');

/**
 * Writes a prerendered HTML file per docs route (`components/button.html`, served by GitHub Pages
 * at `/components/button` with status 200), `sitemap.xml`, and `404.html` as the SPA fallback for
 * unknown paths. Search engines get each page's title, description and content without running
 * JS; the SPA then mounts over it.
 */
export function staticPages(): Plugin {
    let base = '/';
    return {
        name: 'jarvis-docs:static-pages',
        apply: 'build',
        enforce: 'post',
        configResolved(config) {
            base = config.base;
        },
        generateBundle(_options, bundle) {
            const index = bundle['index.html'];
            if (index?.type !== 'asset' || typeof index.source !== 'string') {
                this.error('static pages: index.html missing from the bundle');
            }
            const input = loadLlmsInput(readApi(), DOCS_URL);
            const markdown = buildLlms(input).pages;
            const files = buildStaticPages({
                baseUrl: DOCS_URL,
                base,
                template: index.source,
                groupOrder: input.groupOrder,
                pages: input.pages.map((page) => ({
                    slug: page.slug,
                    title: page.title,
                    group: page.group,
                    description: leadText(page.mdx),
                    markdown:
                        page.slug === 'changelog'
                            ? readFileSync(CHANGELOG, 'utf8')
                            : (markdown.get(`${page.slug === '' ? 'index' : page.slug}.md`) ?? ''),
                })),
            });
            for (const [fileName, source] of files) {
                if (fileName === 'index.html') index.source = source;
                else this.emitFile({ type: 'asset', fileName, source });
            }
        },
    };
}
