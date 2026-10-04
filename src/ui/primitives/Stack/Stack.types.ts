import type { HTMLAttributes, ReactNode } from 'react';

/** Spacing step, mapped onto the `--s-*` tokens: `xs` 4px, `sm` 8px, `md` 12px, `lg` 24px, `xl` 32px. */
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type StackDirection = 'column' | 'row';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
    /** Lays the children out in a column (top to bottom) or a row (left to right). @default 'column' */
    direction?: StackDirection;
    /** Space between the children. @default 'md' */
    gap?: StackGap;
    /** Alignment across the direction (`align-items`). @default 'stretch' */
    align?: StackAlign;
    /** Distribution along the direction (`justify-content`). @default 'start' */
    justify?: StackJustify;
    /** Lets the children wrap onto further lines. @default false */
    wrap?: boolean;
    /** Content to lay out. */
    children?: ReactNode;
    /** Additional class names for the root `<div>`. */
    className?: string;
}
