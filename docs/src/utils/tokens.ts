import type { DesignToken, TokenGroup } from './tokens.types';

const GROUP_RE = /^\s*\/\*\s*(.+?)\s*\*\/\s*$/;
const TOKEN_RE = /^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.+?)\s*\*\/)?\s*$/;

/**
 * Parses the `:root` block of tokens.css into groups. A comment on its own line starts a new
 * group (`/* Core palette *\/`); a trailing comment on a token line becomes its note.
 */
export function parseTokens(css: string): TokenGroup[] {
    const root = /:root\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? '';
    const groups: TokenGroup[] = [];
    let current: TokenGroup = { name: 'Tokens', tokens: [] };

    for (const line of root.split('\n')) {
        const group = GROUP_RE.exec(line);
        if (group?.[1] !== undefined) {
            if (current.tokens.length > 0) groups.push(current);
            current = { name: group[1].replace(/\s*\(.*\)$/, ''), tokens: [] };
            continue;
        }
        const token = TOKEN_RE.exec(line);
        if (token?.[1] !== undefined && token[2] !== undefined) {
            const t: DesignToken = { name: token[1], value: token[2].trim() };
            if (token[3] !== undefined) t.note = token[3];
            current.tokens.push(t);
        }
    }
    if (current.tokens.length > 0) groups.push(current);
    return groups;
}

export function isColor(value: string): boolean {
    return /^(#|rgba?\()/.test(value);
}

export function isShadow(value: string): boolean {
    return /^(inset\s+)?0 0 \d+px/.test(value);
}
