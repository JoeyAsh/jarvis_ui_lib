import type { ReactNode } from 'react';

/** Props of the `CodeBlock` component. */
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
    /**
     * Called with the code after it was copied to the clipboard, e.g. to show a toast. Not called
     * when copying fails or the clipboard API is unavailable.
     */
    onCopy?: (code: string) => void;
    /** Content rendered at the right end of the header, next to the copy button. */
    actions?: ReactNode;
    /** Additional class names for the outer frame (wraps the header and the `<pre>`). */
    className?: string;
}
