import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { PAGES } from '../src/nav.ts';
import type { SearchDoc } from '../src/search.types.ts';

const VIRTUAL_ID = 'virtual:search-index';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;
const DOCS_DIR = resolve(import.meta.dirname, '..');
const PAGES_DIR = join(DOCS_DIR, 'src/pages');
const API_DIR = join(DOCS_DIR, 'generated/api');

function listMdx(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) return listMdx(full);
        return entry.name.endsWith('.mdx') ? [full] : [];
    });
}

/** Plain searchable text of an MDX page: no imports, code, JSX tags or Markdown syntax. */
function plainText(mdx: string): string {
    return mdx
        .replace(/^import .*$/gm, ' ')
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[#*`>|_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** Prop names from the generated API data of the component `<ApiTable component="X" />` names. */
function propNames(mdx: string): string[] {
    const component = /<ApiTable component="([^"]+)"/.exec(mdx)?.[1];
    if (component === undefined) return [];
    const file = join(API_DIR, `${component}.json`);
    if (!existsSync(file)) return [];
    const api = JSON.parse(readFileSync(file, 'utf8')) as { props?: { name: string }[] };
    return (api.props ?? []).map((p) => p.name);
}

function buildIndex(): SearchDoc[] {
    return listMdx(PAGES_DIR).flatMap((file) => {
        const rel = relative(PAGES_DIR, file)
            .replace(/\\/g, '/')
            .replace(/\.mdx$/, '');
        const slug = rel === 'index' ? '' : rel;
        const page = PAGES.find((p) => p.slug === slug);
        if (page === undefined) return [];
        const mdx = readFileSync(file, 'utf8');
        const headings = [...mdx.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => (m[1] ?? '').trim());
        return [
            {
                id: slug === '' ? 'home' : slug,
                slug,
                title: page.title,
                group: page.group ?? 'Overview',
                headings,
                props: propNames(mdx).join(' '),
                text: plainText(mdx),
            },
        ];
    });
}

/**
 * Exposes `virtual:search-index`: one document per docs page (title, group, headings, prop names
 * and plain text), built from the MDX sources so search always matches the published pages.
 */
export function searchIndex(): Plugin {
    return {
        name: 'jarvis-docs:search-index',
        resolveId(id) {
            return id === VIRTUAL_ID ? RESOLVED_ID : null;
        },
        load(id) {
            if (id !== RESOLVED_ID) return null;
            for (const file of listMdx(PAGES_DIR)) this.addWatchFile(file);
            return `export default ${JSON.stringify(buildIndex())};`;
        },
        handleHotUpdate({ file, server }) {
            if (!file.endsWith('.mdx')) return;
            const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
            if (mod) server.moduleGraph.invalidateModule(mod);
        },
    };
}
