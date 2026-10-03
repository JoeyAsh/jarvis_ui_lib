import { Table } from 'jarvis-react-ui';
import type { TableColumn } from 'jarvis-react-ui';

interface LogEntry {
    time: string;
    source: string;
    message: string;
}

const ROWS: LogEntry[] = [
    { time: '12:04:31', source: 'uplink', message: 'Link established' },
    { time: '12:04:32', source: 'auth', message: 'Handshake ok' },
    { time: '12:04:33', source: 'telemetry', message: 'Streaming started' },
];

const COLUMNS: TableColumn<LogEntry>[] = [
    { key: 'time', header: 'Time', className: 'w-[90px] text-text-muted', render: (r) => r.time },
    {
        key: 'source',
        header: 'Source',
        className: 'w-[110px] text-accent',
        render: (r) => r.source,
    },
    { key: 'message', header: 'Message', render: (r) => r.message },
];

export default function DenseWithCaption() {
    return (
        <Table
            caption="Event log"
            showCaption
            dense
            columns={COLUMNS}
            rows={ROWS}
            getRowKey={(r, index) => `${r.time}-${index}`}
        />
    );
}
