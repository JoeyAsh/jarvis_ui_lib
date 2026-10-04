import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [tailwindcss(), react()],
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
            { find: /^@test\/(.*)/, replacement: resolve(import.meta.dirname, 'src/test') + '/$1' },
            { find: /^@docs\/(.*)/, replacement: resolve(import.meta.dirname, 'docs/src') + '/$1' },
        ],
    },
    build: { outDir: 'dist-showcase', emptyOutDir: true },
    server: { port: 5173, open: true },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
    },
});
