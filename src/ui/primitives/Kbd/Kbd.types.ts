import type { HTMLAttributes, ReactNode } from 'react';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
    /** The key or key combination, e.g. `Ctrl K`. Use one `Kbd` per key for combos if you prefer. */
    children: ReactNode;
    /** Text size of the chip. @default 'sm' */
    size?: KbdSize;
    /** Additional class names for the `<kbd>` element. */
    className?: string;
}
