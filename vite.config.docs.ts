import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { resolve } from 'node:path';
import { demoSource } from './docs/plugins/demoSource.ts';
import { rehypeCodeBlock } from './docs/plugins/rehypeCodeBlock.ts';
import { staticPages } from './docs/plugins/staticPages.ts';
import { searchIndex } from './docs/plugins/searchIndex.ts';
import { llmsTxt } from './docs/plugins/llmsTxt.ts';

/**
 * Documentation site (docs/). Built to dist-docs/ and deployed to GitHub Pages under
 * /jarvis_ui_lib/. Consumes the library from source through the same aliases as vite.config.ts.
 */
export default defineConfig({
    root: resolve(import.meta.dirname, 'docs'),
    base: '/jarvis_ui_lib/',
    publicDir: resolve(import.meta.dirname, 'public'),
    plugins: [
        demoSource(),
        searchIndex(),
        {
            enforce: 'pre',
            ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeCodeBlock] }),
        },
        tailwindcss(),
        react({ include: /\.(mdx|md|jsx|js|tsx|ts)$/ }),
        staticPages(),
        llmsTxt(),
    ],
    resolve: {
        alias: [
            // The package's own name, so docs demos import exactly like consumers do.
            {
                find: /^jarvis-react-ui$/,
                replacement: resolve(import.meta.dirname, 'src/lib.ts'),
            },
            {
                find: /^jarvis-react-ui\/orb$/,
                replacement: resolve(import.meta.dirname, 'src/ui/orb/index.ts'),
            },
            {
                find: /^jarvis-react-ui\/generative$/,
                replacement: resolve(import.meta.dirname, 'src/ui/generative/index.ts'),
            },
            { find: /^@ui$/, replacement: resolve(import.meta.dirname, 'src/ui/index.ts') },
            { find: /^@ui\/(.*)/, replacement: resolve(import.meta.dirname, 'src/ui') + '/$1' },
            { find: /^@core\/(.*)/, replacement: resolve(import.meta.dirname, 'src/core') + '/$1' },
            {
                find: /^@common\/(.*)/,
                replacement: resolve(import.meta.dirname, 'src/common') + '/$1',
            },
            { find: /^@docs\/(.*)/, replacement: resolve(import.meta.dirname, 'docs/src') + '/$1' },
        ],
    },
    build: {
        outDir: resolve(import.meta.dirname, 'dist-docs'),
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
    },
    server: { port: 5174 },
    preview: { port: 4174 },
});
