/**
 * Docs coverage check (`npm run docs:check`).
 *
 * For every public component it verifies: a page at docs/src/pages/components/<slug>.mdx with an
 * `<ApiTable component="<Name>" />`, at least one demo in docs/src/demos/<slug>/, a sidebar entry
 * in docs/src/nav.ts, and a JSDoc description on every own prop (from docs/generated/api, so run
 * `npm run docs:api` first). It also checks that nav entries and page files match one to one.
 *
 * Flags:
 *   --strict          exit 1 on any finding (CI once every component is documented)
 *   --only A,B        check only these components, and fail on their findings
 *
 * Without flags, coverage gaps are reported as warnings and only nav/page mismatches fail.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { listPublicComponents, ROOT } from './publicApi';
import { PAGES } from '../docs/src/nav';
import type { ApiDoc } from '../docs/src/api.types';

const PAGES_DIR = join(ROOT, 'docs/src/pages');
const DEMOS_DIR = join(ROOT, 'docs/src/demos');
const API_DIR = join(ROOT, 'docs/generated/api');

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const onlyArg = args.find((a) => a.startsWith('--only'));
const onlyValue = onlyArg?.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf('--only') + 1];
const only = onlyArg ? new Set((onlyValue ?? '').split(',').filter(Boolean)) : null;

function listMdx(dir: string): string[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) return listMdx(full);
        return entry.name.endsWith('.mdx') ? [full] : [];
    });
}

function slugOfPage(file: string): string {
    const rel = relative(PAGES_DIR, file)
        .replace(/\\/g, '/')
        .replace(/\.mdx$/, '');
    return rel === 'index' ? '' : rel;
}

const structural: string[] = [];
const coverage = new Map<string, string[]>();

/* ── nav ↔ pages ─────────────────────────────────────────────────────────── */

const pageSlugs = new Set(listMdx(PAGES_DIR).map(slugOfPage));
const navSlugs = new Set(PAGES.map((p) => p.slug));

for (const slug of navSlugs) {
    if (!pageSlugs.has(slug))
        structural.push(`nav.ts lists "${slug}" but the page file is missing`);
}
for (const slug of pageSlugs) {
    if (!navSlugs.has(slug)) structural.push(`page "${slug}.mdx" has no entry in docs/src/nav.ts`);
}

/* ── per-component coverage ──────────────────────────────────────────────── */

const components = listPublicComponents().filter((c) => only === null || only.has(c.name));

if (only !== null) {
    for (const name of only) {
        if (!components.some((c) => c.name === name)) {
            structural.push(`--only: "${name}" is not a public component`);
        }
    }
}

for (const component of components) {
    const problems: string[] = [];
    const slug = `components/${component.slug}`;
    const pageFile = join(PAGES_DIR, `${slug}.mdx`);

    if (!existsSync(pageFile)) {
        problems.push(`no page docs/src/pages/${slug}.mdx`);
    } else {
        const mdx = readFileSync(pageFile, 'utf8');
        if (!mdx.includes(`<ApiTable component="${component.name}"`)) {
            problems.push(`page has no <ApiTable component="${component.name}" />`);
        }
        if (!/<Demo\s/.test(mdx)) problems.push('page embeds no <Demo />');
    }

    const demoDir = join(DEMOS_DIR, component.slug);
    const demos = existsSync(demoDir) ? readdirSync(demoDir).filter((f) => f.endsWith('.tsx')) : [];
    if (demos.length === 0) problems.push(`no demo in docs/src/demos/${component.slug}/`);

    if (!navSlugs.has(slug)) problems.push('no sidebar entry in docs/src/nav.ts');

    const apiFile = join(API_DIR, `${component.name}.json`);
    if (!existsSync(apiFile)) {
        problems.push('no generated API data (run `npm run docs:api`)');
    } else {
        const api = JSON.parse(readFileSync(apiFile, 'utf8')) as ApiDoc;
        const undocumented = api.props.filter((p) => p.description === '').map((p) => p.name);
        if (undocumented.length > 0) {
            problems.push(`props without JSDoc: ${undocumented.join(', ')}`);
        }
    }

    if (problems.length > 0) coverage.set(component.name, problems);
}

/* ── report ──────────────────────────────────────────────────────────────── */

for (const message of structural) console.error(`✗ ${message}`);

for (const [name, problems] of coverage) {
    console.log(`${strict || only !== null ? '✗' : '!'} ${name}`);
    for (const p of problems) console.log(`    - ${p}`);
}

const documented = components.length - coverage.size;
console.log(
    `\ndocs:check — ${documented}/${components.length} components fully documented` +
        (structural.length > 0 ? `, ${structural.length} structural error(s)` : ''),
);

const failOnCoverage = (strict || only !== null) && coverage.size > 0;
if (structural.length > 0 || failOnCoverage) process.exit(1);
