/**
 * Generates the API reference data for the docs site: one JSON file per public component in
 * docs/generated/api/, extracted from the TypeScript props (types + JSDoc) with
 * react-docgen-typescript. Run via `npm run docs:api`; the output is gitignored.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildApiDocs } from './apiDocs';
import { ROOT } from './publicApi';

const OUT_DIR = join(ROOT, 'docs/generated/api');

const components = buildApiDocs();

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

for (const api of components) {
    writeFileSync(join(OUT_DIR, `${api.name}.json`), `${JSON.stringify(api, null, 2)}\n`);
}

const index = components.map(({ name, slug, group }) => ({ name, slug, group }));
writeFileSync(join(OUT_DIR, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
console.log(`docs:api — wrote ${components.length} component API files to docs/generated/api/`);
