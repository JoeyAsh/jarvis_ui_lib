import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { TableProps } from './Table.types';

const ALIGN_CLASSES = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
} as const;

export function Table<T>({
    columns,
    rows,
    getRowKey,
    caption,
    showCaption = false,
    dense = false,
    emptyText = 'No data',
    className,
}: TableProps<T>): ReactElement {
    const cellPad = dense ? 'px-[10px] py-[5px]' : 'px-[12px] py-[8px]';

    return (
        <div
            className={cx(
                'w-full overflow-x-auto border border-border rounded-[2px] bg-[rgba(13,13,20,0.75)]',
                className,
            )}
        >
            <table className="w-full border-collapse font-mono text-[11px] text-text">
                {caption !== undefined && (
                    <caption
                        className={cx(
                            showCaption
                                ? 'px-[12px] py-[8px] text-left text-[9px] uppercase tracking-[1px] text-text-secondary border-b border-border'
                                : 'sr-only',
                        )}
                    >
                        {caption}
                    </caption>
                )}
                <thead>
                    <tr className="border-b border-border-bright">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={cx(
                                    cellPad,
                                    'text-[9px] font-normal uppercase tracking-[1px] text-text-secondary',
                                    ALIGN_CLASSES[col.align ?? 'left'],
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className={cx(cellPad, 'text-center text-text-muted')}
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, index) => (
                            <tr
                                key={getRowKey(row, index)}
                                className="border-b border-border last:border-b-0 transition-colors duration-[150ms] hover:bg-[rgba(76,168,232,0.05)]"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cx(
                                            cellPad,
                                            'align-top',
                                            ALIGN_CLASSES[col.align ?? 'left'],
                                            col.className,
                                        )}
                                    >
                                        {col.render(row, index)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
