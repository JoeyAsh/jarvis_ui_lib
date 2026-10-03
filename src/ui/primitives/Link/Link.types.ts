import type { AnchorHTMLAttributes, ReactNode } from 'react';

export type LinkVariant = 'accent' | 'muted' | 'nav';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * Visual style: `accent` for inline text links, `muted` for secondary links,
     * `nav` for uppercase navigation links. @default 'accent'
     */
    variant?: LinkVariant;
    /** Opens in a new tab with `rel="noopener noreferrer"` and shows an external-link icon. @default false */
    external?: boolean;
    /** Marks the link as the current page (`aria-current="page"`) and highlights it. @default false */
    active?: boolean;
    className?: string;
    children: ReactNode;
}
