/**
 * Writes the language-model files into the package build: dist/llms.txt, dist/llms-full.txt and
 * dist/api.json, so AI coding assistants find docs matching the installed version in
 * node_modules. Runs after the Vite library build (which empties dist/) via `npm run build:lib`.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildApiDocs } from './apiDocs';
import { buildLlms } from './llms/build';
import { loadLlmsInput } from './llms/load';
import { ROOT } from './publicApi';

const OUT_DIR = join(ROOT, 'dist');

const { index, full, api } = buildLlms(loadLlmsInput(buildApiDocs()));

writeFileSync(join(OUT_DIR, 'llms.txt'), index);
writeFileSync(join(OUT_DIR, 'llms-full.txt'), full);
writeFileSync(join(OUT_DIR, 'api.json'), `${JSON.stringify(api, null, 2)}\n`);
console.log(
    `gen-llms — wrote dist/llms.txt, dist/llms-full.txt and dist/api.json (${api.components.length} components)`,
);
