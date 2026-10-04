import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dirname, '..');

export type ComponentGroup = 'primitives' | 'compositions' | 'window' | 'orb' | 'generative';

export interface PublicComponent {
    /** Export name, e.g. `IconButton`. */
    name: string;
    /** Docs slug, e.g. `icon-button`. */
    slug: string;
    group: ComponentGroup;
    /** Repo-relative path of the component source file. */
    file: string;
    /** Entry point consumers import it from. */
    entry: 'jarvis-react-ui' | 'jarvis-react-ui/orb' | 'jarvis-react-ui/generative';
}

const BARRELS = [
    { barrel: 'src/ui/index.ts', base: 'src/ui', entry: 'jarvis-react-ui' },
    { barrel: 'src/ui/orb/index.ts', base: 'src/ui/orb', entry: 'jarvis-react-ui/orb' },
    {
        barrel: 'src/ui/generative/index.ts',
        base: 'src/ui/generative',
        entry: 'jarvis-react-ui/generative',
    },
] as const;

const EXPORT_RE = /^export\s*\{([^}]+)\}\s*from\s*'\.\/([^']+)';/gm;

/** `IconButton` → `icon-button`, `HUDShell` → `hud-shell`, `CssOrb` → `css-orb`. */
export function toSlug(name: string): string {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

function groupOf(file: string): ComponentGroup {
    if (file.includes('/compositions/')) return 'compositions';
    if (file.includes('/window/')) return 'window';
    if (file.includes('/orb/')) return 'orb';
    if (file.includes('/generative/')) return 'generative';
    return 'primitives';
}

/**
 * Every public React component of the package: PascalCase value exports of the two entry barrels
 * that have a matching `<Name>.tsx` file. Hooks, helpers and constants are skipped.
 */
export function listPublicComponents(): PublicComponent[] {
    const seen = new Map<string, PublicComponent>();
    for (const { barrel, base, entry } of BARRELS) {
        const source = readFileSync(join(ROOT, barrel), 'utf8');
        for (const match of source.matchAll(EXPORT_RE)) {
            const names = (match[1] ?? '')
                .split(',')
                .map(
                    (n) =>
                        n
                            .trim()
                            .split(/\s+as\s+/)[0]
                            ?.trim() ?? '',
                )
                .filter((n) => /^[A-Z][A-Za-z0-9]*$/.test(n) && n.toUpperCase() !== n);
            for (const name of names) {
                const dir = `${base}/${match[2] ?? ''}`;
                const candidates = [`${dir}/${name}.tsx`, `${dir}.tsx`];
                const file = candidates.find((c) => existsSync(join(ROOT, c)));
                if (file === undefined || seen.has(name)) continue;
                seen.set(name, { name, slug: toSlug(name), group: groupOf(file), file, entry });
            }
        }
    }
    return [...seen.values()];
}
