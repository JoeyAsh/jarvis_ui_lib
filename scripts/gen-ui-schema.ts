/**
 * Writes the schema of generated-window specs into the package build: dist/ui-schema.json (JSON
 * Schema of `UiWindowSpec`) and dist/ui-tools.json (tool definitions for the Claude API). Runs in
 * `npm run build:lib` after the Vite build; an unmappable prop type fails the build.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildApiDocs } from './apiDocs';
import { ROOT } from './publicApi';
import { buildUiSchema, buildUiTools } from './uiSchema';

const schema = buildUiSchema(buildApiDocs());
const tools = buildUiTools(schema);

writeFileSync(join(ROOT, 'dist/ui-schema.json'), `${JSON.stringify(schema, null, 2)}\n`);
writeFileSync(join(ROOT, 'dist/ui-tools.json'), `${JSON.stringify(tools, null, 2)}\n`);

const kb = (value: unknown): string => `${(JSON.stringify(value).length / 1024).toFixed(0)} kB`;
console.log(`gen-ui-schema — wrote dist/ui-schema.json (${kb(schema)}) and dist/ui-tools.json`);
