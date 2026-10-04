import type { ReactNode } from 'react';

/** Horizontal alignment of a `Table` column. */
export type TableAlign = 'left' | 'center' | 'right';

/** Definition of one `Table` column; `T` is the row type. */
export interface TableColumn<T> {
    /** Unique key of the column; used as the React key of its cells. */
    key: string;
    /** Header cell content. */
    header: ReactNode;
    /** Renders the cell content for a row; `index` is the row's position in `rows`. */
    render: (row: T, index: number) => ReactNode;
    /** Horizontal alignment of header and cells. @default 'left' */
    align?: TableAlign;
    /** Extra class name for every cell in this column, e.g. one that sets the column width. */
    className?: string;
}

/** Props of the `Table` component; `T` is the row type. */
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
    /** Additional class names for the scroll container that wraps the `<table>`. */
    className?: string;
}
