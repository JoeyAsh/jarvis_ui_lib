import type { ReactNode } from 'react';
import type { TableColumn } from '../compositions/Table';
import type { TabItem } from '../compositions/Tabs';
import type { UiAdaptContext, UiComponentProps, UiJsonObject } from './registry.types';
import { isNode, isPlainObject } from './resolve';

function cellText(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    return JSON.stringify(value);
}

/**
 * `Table` from a spec: `columns` are `{ key, header, align? }` and every cell shows `row[key]`;
 * rows are keyed by their `id` field or their index.
 */
export function adaptTable(props: UiComponentProps): UiComponentProps {
    const rawColumns = Array.isArray(props.columns) ? props.columns : [];
    const columns: TableColumn<UiJsonObject>[] = rawColumns.filter(isPlainObject).map((c) => {
        const key = typeof c.key === 'string' ? c.key : '';
        return {
            key,
            header: typeof c.header === 'string' ? c.header : key,
            align: c.align === 'center' || c.align === 'right' ? c.align : 'left',
            render: (row: UiJsonObject) => cellText(row[key]),
        };
    });
    const rows = Array.isArray(props.rows) ? props.rows.filter(isPlainObject) : [];
    return {
        ...props,
        columns,
        rows,
        getRowKey: (row: UiJsonObject, index: number) =>
            typeof row.id === 'string' || typeof row.id === 'number'
                ? String(row.id)
                : String(index),
    };
}

/** `Tabs` from a spec: each item's `label` and `content` may be text or a node. */
export function adaptTabs(props: UiComponentProps, ctx: UiAdaptContext): UiComponentProps {
    const raw = Array.isArray(props.items) ? props.items : [];
    const items: TabItem[] = raw.filter(isPlainObject).map((item, index) => {
        const value = typeof item.value === 'string' ? item.value : String(index);
        const render = (content: unknown, part: string): ReactNode =>
            typeof content === 'string' || isNode(content)
                ? ctx.renderNode(content, `${value}-${part}`)
                : null;
        return {
            value,
            label: render(item.label, 'label') ?? value,
            content: render(item.content, 'content'),
            disabled: item.disabled === true,
        };
    });
    return { ...props, items };
}
