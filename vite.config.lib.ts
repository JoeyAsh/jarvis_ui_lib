import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

const root = import.meta.dirname;

/** Library build: ESM, single CSS file, declarations. Run via `npm run build:lib`. */
export default defineConfig({
    publicDir: false,
    plugins: [
        tailwindcss(),
        react(),
        dts({
            tsconfigPath: resolve(root, 'tsconfig.lib.json'),
            entryRoot: resolve(root, 'src'),
            include: ['src'],
            exclude: ['src/**/__tests__/**', 'src/test/**', 'src/ui/showcase/**'],
        }),
    ],
    resolve: {
        alias: [
            { find: /^@ui$/, replacement: resolve(root, 'src/ui/index.ts') },
            { find: /^@ui\/(.*)/, replacement: resolve(root, 'src/ui') + '/$1' },
            { find: /^@core\/(.*)/, replacement: resolve(root, 'src/core') + '/$1' },
            { find: /^@common\/(.*)/, replacement: resolve(root, 'src/common') + '/$1' },
        ],
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        sourcemap: true,
        lib: {
            entry: {
                index: resolve(root, 'src/lib.ts'),
                orb: resolve(root, 'src/ui/orb/index.ts'),
            },
            formats: ['es'],
            cssFileName: 'style',
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                'three',
                /^three\//,
                'lucide-react',
                /^lucide-react\//,
            ],
        },
    },
});
