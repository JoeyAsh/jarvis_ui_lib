import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';
import { jarvisTheme } from './jarvisTheme.ts';

const LANGS = ['tsx', 'ts', 'jsx', 'js', 'bash', 'css', 'json', 'html'] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
    highlighterPromise ??= createHighlighter({ themes: [jarvisTheme], langs: [...LANGS] });
    return highlighterPromise;
}

/** Normalizes fence names (`sh`, `shell`, `typescript`, ...) to a loaded language. */
function resolveLang(lang: string | undefined): string {
    const l = (lang ?? '').toLowerCase();
    if (l === 'sh' || l === 'shell' || l === 'zsh') return 'bash';
    if (l === 'typescript') return 'ts';
    if (l === 'javascript') return 'js';
    return (LANGS as readonly string[]).includes(l) ? l : 'tsx';
}

/**
 * Highlights `code` and returns the markup that belongs inside a `<code>` element (the `<pre>`
 * wrapper shiki emits is dropped; `CodeBlock` renders its own).
 */
export async function highlightToInnerHtml(code: string, lang?: string): Promise<string> {
    const highlighter = await getHighlighter();
    const html = highlighter.codeToHtml(code.replace(/\n$/, ''), {
        lang: resolveLang(lang),
        theme: 'jarvis',
    });
    const match = /<code[^>]*>([\s\S]*)<\/code>/.exec(html);
    return match?.[1] ?? '';
}
