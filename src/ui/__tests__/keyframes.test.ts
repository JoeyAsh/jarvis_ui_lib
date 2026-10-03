/// <reference types="node" />
// Node types are referenced explicitly: the app tsconfig only loads browser types, and Vitest
// stubs CSS imports (even `?raw`), so the stylesheets are read from disk.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import { join } from 'node:path';

const UI_DIR = join(process.cwd(), 'src/ui');

function sourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry: Dirent) => {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            return entry.name === '__tests__' ? [] : sourceFiles(full);
        }
        return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
    });
}

function stylesheets(): string[] {
    return sourceFiles(UI_DIR)
        .filter((f) => f.endsWith('.css'))
        .map((f) => readFileSync(f, 'utf8'));
}

describe('keyframes', () => {
    it('every jlib-* animation used by a component is defined in a stylesheet', () => {
        const files = sourceFiles(UI_DIR);
        const read = (f: string): string => readFileSync(f, 'utf8');
        const defined = new Set(
            stylesheets().flatMap((text) =>
                [...text.matchAll(/@keyframes\s+(jlib-[\w-]+)/g)].map((m) => m[1]),
            ),
        );
        // Uses anywhere: inline styles and Tailwind arbitrary classes (`animate-[jlib-x_200ms…]`) in
        // TS/TSX, and `animation` declarations in CSS. Excluded: the @keyframes definitions
        // themselves and `--jlib-*` custom properties (variables, not animations).
        const used = new Set(
            files.flatMap((f) => {
                const text = read(f).replace(/@keyframes\s+jlib-[\w-]+/g, '');
                return [...text.matchAll(/(?<!-)jlib-[a-z0-9-]*[a-z0-9]/g)].map((m) => m[0]);
            }),
        );
        const missing = [...used].filter((name) => !defined.has(name));

        expect(used.size).toBeGreaterThan(0);
        expect(missing).toEqual([]);
    });

    it('does not redefine Tailwind default keyframes (style.css would override animate-spin etc.)', () => {
        const clashes = stylesheets().flatMap((text) =>
            [...text.matchAll(/@keyframes\s+(spin|ping|pulse|bounce)\b/g)].map((m) => m[1]),
        );
        expect(clashes).toEqual([]);
    });
});
