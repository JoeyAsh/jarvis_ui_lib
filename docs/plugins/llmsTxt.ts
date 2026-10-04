import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import type { ApiDoc } from '../src/api.types.ts';
import { buildLlms } from '../../scripts/llms/build.ts';
import type { LlmsOutput } from '../../scripts/llms/build.ts';
import { DOCS_URL, loadLlmsInput } from '../../scripts/llms/load.ts';

const API_DIR = join(import.meta.dirname, '../generated/api');

/** API data written by `npm run docs:api` (which docs:dev and build:docs run first). */
function readApi(): ApiDoc[] {
    if (!existsSync(API_DIR)) return [];
    return readdirSync(API_DIR)
        .filter((f) => f.endsWith('.json') && f !== 'index.json')
        .map((f) => JSON.parse(readFileSync(join(API_DIR, f), 'utf8')) as ApiDoc);
}

/** Every emitted file by path below the site root. */
function files(out: LlmsOutput): Map<string, string> {
    return new Map([['llms.txt', out.index], ['llms-full.txt', out.full], ...out.pages]);
}

/**
 * Serves the docs for language models (llmstxt.org): `/llms.txt`, `/llms-full.txt` and a Markdown
 * version of every page at `<route>.md` (`/index.md` for the landing page). Built from the same
 * MDX, demos and generated API data as the site.
 */
export function llmsTxt(): Plugin {
    let base = '/';
    return {
        name: 'jarvis-docs:llms-txt',
        configResolved(config) {
            base = config.base;
        },
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = (req.url ?? '').split('?')[0] ?? '';
                if (!url.startsWith(base) || !/\.(md|txt)$/.test(url)) {
                    next();
                    return;
                }
                const body = files(buildLlms(loadLlmsInput(readApi(), DOCS_URL))).get(
                    url.slice(base.length),
                );
                if (body === undefined) {
                    next();
                    return;
                }
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.end(body);
            });
        },
        generateBundle() {
            for (const [fileName, source] of files(buildLlms(loadLlmsInput(readApi(), DOCS_URL)))) {
                this.emitFile({ type: 'asset', fileName, source });
            }
        },
    };
}
