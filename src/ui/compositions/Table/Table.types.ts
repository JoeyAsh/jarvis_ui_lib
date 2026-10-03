import type { ReactNode } from 'react';

export type TableAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
    /** Unique key of the column. */
    key: string;
    /** Header cell content. */
    header: ReactNode;
    /** Renders the cell for a row. */
    render: (row: T, index: number) => ReactNode;
    /** Horizontal alignment of header and cells. @default 'left' */
    align?: TableAlign;
    /** Extra class name for every cell in this column, e.g. a width (`w-[30%]`). */
    className?: string;
}

export interface TableProps<T> {
    /** Column definitions in display order. */
    columns: TableColumn<T>[];
    /** Data rows. */
    rows: T[];
    /** Returns a stable unique key for a row. */
    getRowKey: (row: T, index: number) => string;
    /** Accessible caption, rendered visually hidden unless `showCaption` is set. */
    caption?: ReactNode;
    /** Shows the caption above the table. @default false */
    showCaption?: boolean;
    /** Tighter cell padding. @default false */
    dense?: boolean;
    /** Content shown in a single full-width row when `rows` is empty. @default 'No data' */
    emptyText?: ReactNode;
    className?: string;
}
