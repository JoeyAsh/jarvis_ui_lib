import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

/**
 * GitHub Pages serves `404.html` for unknown paths. Copying `index.html` there lets deep links
 * (e.g. `/jarvis_ui_lib/components/button`) boot the SPA, which then routes client-side.
 */
export function spaFallback(): Plugin {
    let outDir = '';
    return {
        name: 'jarvis-docs:spa-fallback',
        apply: 'build',
        configResolved(config: ResolvedConfig) {
            outDir = config.build.outDir;
        },
        async closeBundle() {
            await copyFile(join(outDir, 'index.html'), join(outDir, '404.html'));
        },
    };
}
