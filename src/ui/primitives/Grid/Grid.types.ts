import type { HTMLAttributes, ReactNode } from 'react';
import type { StackGap } from '../Stack/Stack.types';

/** Fixed number of equal columns, or `auto` to fit as many as `minColumnWidth` allows. */
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 'auto';

export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
    /** Number of equal columns, or `auto` for as many columns of `minColumnWidth` as fit. @default 'auto' */
    columns?: GridColumns;
    /** Minimum column width in px for `columns="auto"`. @default 160 */
    minColumnWidth?: number;
    /** Space between rows and columns (`--s-*` tokens). @default 'md' */
    gap?: StackGap;
    /** Vertical alignment of the cells within their row. @default 'stretch' */
    align?: GridAlign;
    /** Cells, one per child. */
    children?: ReactNode;
    /** Additional class names for the root `<div>`. */
    className?: string;
}
