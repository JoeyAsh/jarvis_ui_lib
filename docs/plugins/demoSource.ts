import { readFile } from 'node:fs/promises';
import type { Plugin } from 'vite';
import { highlightToInnerHtml } from './highlight.ts';

const QUERY = '?highlight';

/**
 * `import src from './Demo.tsx?highlight'` resolves to `{ code, html }`: the file's raw source and
 * its shiki-highlighted markup, computed at build time. Demo pages therefore always show the exact
 * code that renders the live preview, with no highlighter shipped to the browser.
 */
export function demoSource(): Plugin {
    return {
        name: 'jarvis-docs:demo-source',
        enforce: 'pre',
        async load(id) {
            if (!id.endsWith(QUERY)) return null;
            const file = id.slice(0, -QUERY.length);
            this.addWatchFile(file);
            const code = (await readFile(file, 'utf8')).replace(/\r\n/g, '\n').trimEnd();
            const html = await highlightToInnerHtml(code, 'tsx');
            return `export default ${JSON.stringify({ code, html })};`;
        },
    };
}
