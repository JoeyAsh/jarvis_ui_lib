/**
 * Expands design-token overrides into every variable the components read.
 *
 * - Tailwind theme colors are declared on `:root` as `--color-x: var(--x)`, so they resolve there.
 *   Overriding `--x` on a sub-tree does not reach them; the `--color-x` alias must be set as well.
 * - Glow utilities (`shadow-glow*`) read `--shadow-glow*`, which hold literal values; the `--glow*`
 *   tokens are only used by component stylesheets.
 */
export function expandThemeVars(vars: Record<string, string>): Record<string, string> {
    const out: Record<string, string> = { ...vars };
    for (const [name, value] of Object.entries(vars)) {
        if (name.startsWith('--glow')) {
            out[`--shadow-${name.slice(2)}`] = value;
        } else {
            out[`--color-${name.slice(2)}`] = value;
        }
    }
    return out;
}

/** CSS text for the given variables inside a selector block. */
export function cssBlock(selector: string, vars: Record<string, string>): string {
    const body = Object.entries(vars)
        .map(([k, v]) => `    ${k}: ${v};`)
        .join('\n');
    return `${selector} {\n${body}\n}`;
}
