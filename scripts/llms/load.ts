/**
 * Reads the inputs of `buildLlms` from the repository: docs pages in sidebar order, demo sources,
 * design tokens and the package version.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { GROUP_ORDER, PAGES } from '../../docs/src/nav';
import { parseTokens } from '../../docs/src/utils/tokens';
import type { ApiDoc } from '../../docs/src/api.types';
import { ROOT } from '../publicApi';
import type { LlmsInput } from './build';

/** Public docs URL without trailing slash. */
export const DOCS_URL = 'https://joeyash.github.io/jarvis_ui_lib';

export const PAGES_DIR = join(ROOT, 'docs/src/pages');
export const DEMOS_DIR = join(ROOT, 'docs/src/demos');
export const TOKENS_FILE = join(ROOT, 'src/styles/tokens.css');

function read(file: string): string {
    return readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}

function listFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : [full];
    });
}

export function packageVersion(): string {
    const pkg = JSON.parse(read(join(ROOT, 'package.json'))) as { version: string };
    return pkg.version;
}

export function loadLlmsInput(api: ApiDoc[], baseUrl: string = DOCS_URL): LlmsInput {
    const demos = new Map<string, string>();
    for (const file of listFiles(DEMOS_DIR)) {
        if (!file.endsWith('.tsx')) continue;
        const name = relative(DEMOS_DIR, file)
            .replace(/\\/g, '/')
            .replace(/\.tsx$/, '');
        demos.set(name, read(file).trimEnd());
    }

    return {
        baseUrl,
        version: packageVersion(),
        pages: PAGES.map((page) => ({
            ...page,
            mdx: read(join(PAGES_DIR, `${page.slug === '' ? 'index' : page.slug}.mdx`)),
        })),
        groupOrder: GROUP_ORDER,
        api,
        demos,
        tokens: parseTokens(read(TOKENS_FILE)),
    };
}
