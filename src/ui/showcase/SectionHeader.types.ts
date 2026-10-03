import type { ReactNode } from 'react';

/** Props of the shared heading block at the top of every showcase section. */
export interface SectionHeaderProps {
    /** Section title, rendered as the `h2`. */
    title: string;
    /** One-line description under the title (components covered, interaction hints). */
    children: ReactNode;
}
