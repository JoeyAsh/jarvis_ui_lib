import type { CSSProperties, ReactElement } from 'react';
import { Table } from '@ui';
import type { TableColumn } from '@ui';
import tokensCss from '../../../src/styles/tokens.css?raw';
import { isColor, isShadow, parseTokens } from '../utils/tokens';
import type { DesignToken } from '../utils/tokens.types';
import type { TokenTableProps } from './TokenTable.types';

const GROUPS = parseTokens(tokensCss);

const COLUMNS: TableColumn<DesignToken>[] = [
    {
        key: 'name',
        header: 'Token',
        className: 'whitespace-nowrap',
        render: (t) => <code className="text-accent">{t.name}</code>,
    },
    {
        key: 'value',
        header: 'Value',
        render: (t) => (
            <span className="inline-flex items-center gap-2">
                {isColor(t.value) && (
                    <span
                        aria-hidden="true"
                        className="inline-block w-[14px] h-[14px] shrink-0 rounded-[2px] border border-border-bright bg-[var(--swatch)]"
                        style={{ '--swatch': t.value } as CSSProperties}
                    />
                )}
                {isShadow(t.value) && (
                    <span
                        aria-hidden="true"
                        className="inline-block w-[14px] h-[14px] shrink-0 rounded-[2px] bg-surface shadow-[var(--swatch)]"
                        style={{ '--swatch': t.value } as CSSProperties}
                    />
                )}
                <code className="text-text break-all">{t.value}</code>
            </span>
        ),
    },
    {
        key: 'note',
        header: 'Note',
        className: 'text-text-secondary',
        render: (t) => t.note ?? '',
    },
];

/** Live token table parsed from src/styles/tokens.css, so it never drifts from the source. */
export function TokenTable({ group }: TokenTableProps): ReactElement {
    const groups = group === undefined ? GROUPS : GROUPS.filter((g) => g.name === group);

    return (
        <div className="my-6 flex flex-col gap-6">
            {groups.map((g) => (
                <Table
                    key={g.name}
                    caption={g.name}
                    showCaption
                    dense
                    columns={COLUMNS}
                    rows={g.tokens}
                    getRowKey={(t) => t.name}
                />
            ))}
        </div>
    );
}

export default TokenTable;
