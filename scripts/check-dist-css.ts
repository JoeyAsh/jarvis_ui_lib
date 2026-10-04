/**
 * Guards the library build: fails when dist/style.css lacks the rules of a component stylesheet,
 * a keyframe of ui.css, or the standard `backdrop-filter` next to its `-webkit-` variant (the
 * minifier drops the standard one when it comes first). Every stylesheet aggregated in
 * src/ui/components.css must contribute its first class selector. Runs after the Vite library
 * build via `npm run build:lib`.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ROOT } from './publicApi';

const DIST_CSS = join(ROOT, 'dist/style.css');
const COMPONENTS_CSS = join(ROOT, 'src/ui/components.css');
const UI_CSS = join(ROOT, 'src/ui/ui.css');

const dist = readFileSync(DIST_CSS, 'utf8');
const missing: string[] = [];
let backdropRules = 0;

for (const match of readFileSync(COMPONENTS_CSS, 'utf8').matchAll(/@import\s+'([^']+)'/g)) {
    const css = readFileSync(join(dirname(COMPONENTS_CSS), match[1] ?? ''), 'utf8');
    const selector = /^\.([a-z][\w-]*)/m.exec(css)?.[1];
    if (selector !== undefined && !dist.includes(`.${selector}`)) {
        missing.push(`.${selector} (${match[1] ?? ''})`);
    }
    backdropRules += [...css.matchAll(/^\s*backdrop-filter\s*:/gm)].length;
}

for (const match of readFileSync(UI_CSS, 'utf8').matchAll(/^@keyframes\s+([\w-]+)\s*\{/gm)) {
    if (!dist.includes(`@keyframes ${match[1] ?? ''}`)) {
        missing.push(`@keyframes ${match[1] ?? ''}`);
    }
}

const distBackdrop = [...dist.matchAll(/(?<!-)backdrop-filter:/g)].length;
if (distBackdrop < backdropRules) {
    missing.push(
        `standard backdrop-filter (${distBackdrop} of ${backdropRules}); put it after -webkit-backdrop-filter`,
    );
}

if (missing.length > 0) {
    console.error(`check-dist-css — dist/style.css is missing:\n  ${missing.join('\n  ')}`);
    process.exit(1);
}
console.log('check-dist-css — every component stylesheet and keyframe is in dist/style.css');
