import type { ReactNode, ElementType } from 'react';

export type MonoSize = 'xs' | 'sm' | 'md' | 'lg';

export interface MonoProps {
    /** Text to render in the monospace font. */
    children: ReactNode;
    /** Font size step: `xs` 9px, `sm` 10px, `md` 11px, `lg` 13px. @default 'md' */
    size?: MonoSize;
    /** Additional class names for the rendered element. */
    className?: string;
    /** Element or component to render instead of a `<span>`, e.g. `'p'`, `'code'` or `'time'`. @default 'span' */
    as?: ElementType;
    /** Uses the muted text color; takes precedence over `secondary`. @default false */
    muted?: boolean;
    /** Uses the secondary text color instead of the primary one. @default false */
    secondary?: boolean;
}
