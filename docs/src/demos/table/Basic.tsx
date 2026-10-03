import { Pill, Table } from '@ui';
import type { TableColumn } from '@ui';

interface Subsystem {
    id: string;
    name: string;
    status: 'online' | 'degraded' | 'offline';
    load: number;
}

const ROWS: Subsystem[] = [
    { id: 'pwr', name: 'Power core', status: 'online', load: 72 },
    { id: 'com', name: 'Comms array', status: 'degraded', load: 38 },
    { id: 'nav', name: 'Navigation', status: 'online', load: 15 },
    { id: 'def', name: 'Defense grid', status: 'offline', load: 0 },
];

const STATUS_PILL = { online: 'ok', degraded: 'warn', offline: 'err' } as const;

const COLUMNS: TableColumn<Subsystem>[] = [
    { key: 'name', header: 'Subsystem', render: (row) => row.name },
    {
        key: 'status',
        header: 'Status',
        align: 'center',
        render: (row) => <Pill variant={STATUS_PILL[row.status]}>{row.status}</Pill>,
    },
    {
        key: 'load',
        header: 'Load',
        align: 'right',
        className: 'w-[80px] tabular-nums',
        render: (row) => `${row.load}%`,
    },
];

export default function Basic() {
    return (
        <Table
            caption="Subsystem status"
            columns={COLUMNS}
            rows={ROWS}
            getRowKey={(row) => row.id}
        />
    );
}
