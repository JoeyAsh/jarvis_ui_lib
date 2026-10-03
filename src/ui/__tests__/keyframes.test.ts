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

describe('keyframes', () => {
    it('every jlib-* animation used by a component is defined in a stylesheet', () => {
        const files = sourceFiles(UI_DIR);
        const read = (f: string): string => readFileSync(f, 'utf8');
        const defined = new Set(
            files
                .filter((f) => f.endsWith('.css'))
                .flatMap((f) =>
                    [...read(f).matchAll(/@keyframes\s+(jlib-[\w-]+)/g)].map((m) => m[1]),
                ),
        );
        const used = new Set(
            files
                .filter((f) => /\.tsx?$/.test(f))
                .flatMap((f) => [...read(f).matchAll(/['`"(\s](jlib-[\w-]+)\s/g)].map((m) => m[1])),
        );
        const missing = [...used].filter((name) => !defined.has(name));

        expect(used.size).toBeGreaterThan(0);
        expect(missing).toEqual([]);
    });
});
