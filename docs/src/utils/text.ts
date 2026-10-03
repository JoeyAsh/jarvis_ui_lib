import { Children, isValidElement } from 'react';
import type { ReactNode } from 'react';

/** Plain text of a React node tree (for heading ids). */
export function textContent(node: ReactNode): string {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(textContent).join('');
    if (isValidElement<{ children?: ReactNode }>(node)) {
        return Children.toArray(node.props.children).map(textContent).join('');
    }
    return '';
}

/** URL-safe anchor id: `Controlled vs uncontrolled` → `controlled-vs-uncontrolled`. */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[`'"]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/** Splits `text` on backticks: odd segments are inline code. */
export function splitInlineCode(text: string): { code: boolean; text: string }[] {
    return text
        .split('`')
        .map((segment, i) => ({ code: i % 2 === 1, text: segment }))
        .filter((s) => s.text !== '');
}
