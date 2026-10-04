import { use } from 'react';
import type { ReactElement } from 'react';
import { Pill, Table } from '@ui';
import type { TableColumn } from '@ui';
import type { ApiProp } from '../api.types';
import { apiDoc } from '../utils/registry';
import { DocsCodeBlock } from './DocsCodeBlock';
import { InlineText } from './InlineText';
import type { ApiTableProps, TypeDetailsProps } from './ApiTable.types';

const COLUMNS: TableColumn<ApiProp>[] = [
    {
        key: 'name',
        header: 'Prop',
        className: 'whitespace-nowrap',
        render: (p) => (
            <span className="inline-flex items-center gap-2">
                <code className="text-accent">{p.name}</code>
                {p.required && <Pill variant="warn">required</Pill>}
            </span>
        ),
    },
    {
        key: 'type',
        header: 'Type',
        className: 'min-w-[160px]',
        render: (p) => <code className="text-text break-words">{p.type}</code>,
    },
    {
        key: 'default',
        header: 'Default',
        className: 'whitespace-nowrap',
        render: (p) =>
            p.default === null ? (
                <span className="text-text-muted">—</span>
            ) : (
                <code className="text-warning">{p.default}</code>
            ),
    },
    {
        key: 'description',
        header: 'Description',
        className: 'min-w-[220px] text-text-secondary',
        render: (p) => <InlineText text={p.description} />,
    },
];

const FIELD_COLUMNS: TableColumn<ApiProp>[] = COLUMNS.map((c) =>
    c.key === 'name' ? { ...c, header: 'Field' } : c,
);

/** A helper type the props refer to: its fields, or its definition for unions and aliases. */
function TypeDetails({ type }: TypeDetailsProps): ReactElement {
    return (
        <div className="flex flex-col gap-2">
            {type.description !== '' && (
                <p className="m-0 text-[11px] leading-[1.7] text-text-secondary">
                    <code className="text-accent-bright">{type.name}</code>:{' '}
                    <InlineText text={type.description} />
                </p>
            )}
            {type.definition === null ? (
                <Table
                    caption={type.name}
                    showCaption
                    dense
                    columns={FIELD_COLUMNS}
                    rows={type.fields}
                    getRowKey={(f) => f.name}
                />
            ) : (
                <DocsCodeBlock code={`type ${type.name} = ${type.definition};`} language="ts" />
            )}
        </div>
    );
}

export function ApiTableContent({ component }: ApiTableProps): ReactElement {
    const doc = use(apiDoc(component));
    const forwardsRef = doc.inherited.some((i) => i.from === 'RefAttributes');
    const native = doc.inherited.filter(
        (i) => i.from !== 'RefAttributes' && i.from !== 'Attributes',
    );

    return (
        <div className="my-6 flex flex-col gap-3">
            <Table
                caption={`${doc.name} props`}
                columns={COLUMNS}
                rows={doc.props}
                getRowKey={(p) => p.name}
                emptyText="This component takes no props of its own."
            />
            {(native.length > 0 || forwardsRef) && (
                <p className="m-0 text-[10px] leading-[1.7] text-text-secondary">
                    {native.length > 0 && (
                        <>
                            Other props are passed through to the root element (
                            {native.map((i) => i.from).join(', ')}).{' '}
                        </>
                    )}
                    {forwardsRef && (
                        <>
                            The <code className="text-accent-bright">ref</code> is forwarded to the
                            root element.
                        </>
                    )}
                </p>
            )}
            {doc.types.length > 0 && (
                <>
                    <p className="m-0 mt-2 text-[10px] uppercase tracking-[0.12em] text-text-muted">
                        Types used by the props
                    </p>
                    {doc.types.map((t) => (
                        <TypeDetails key={t.name} type={t} />
                    ))}
                </>
            )}
        </div>
    );
}

export default ApiTableContent;
