import type { ReactNode } from 'react';

export interface CodeBlockProps {
    /** Raw source code. Copied to the clipboard and rendered as plain text when `html` is absent. */
    code: string;
    /**
     * Pre-highlighted markup for the inside of the `<code>` element, e.g. produced by shiki at
     * build time. It is injected as HTML, so it must come from a trusted source, never from user input.
     */
    html?: string;
    /** Language label shown in the header, e.g. `tsx`. */
    language?: string;
    /** Title shown in the header, e.g. a file name. */
    title?: ReactNode;
    /** Shows the copy-to-clipboard button. @default true */
    copyable?: boolean;
    /** Content rendered at the right end of the header, next to the copy button. */
    actions?: ReactNode;
    className?: string;
}
