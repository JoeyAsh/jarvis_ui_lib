import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: [
            { find: /^@ui$/, replacement: resolve(import.meta.dirname, 'src/ui/index.ts') },
            { find: /^@ui\/(.*)/, replacement: resolve(import.meta.dirname, 'src/ui') + '/$1' },
            { find: /^@core\/(.*)/, replacement: resolve(import.meta.dirname, 'src/core') + '/$1' },
            {
                find: /^@common\/(.*)/,
                replacement: resolve(import.meta.dirname, 'src/common') + '/$1',
            },
            { find: /^@test\/(.*)/, replacement: resolve(import.meta.dirname, 'src/test') + '/$1' },
        ],
    },
    server: { port: 5173, open: true },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
    },
});
