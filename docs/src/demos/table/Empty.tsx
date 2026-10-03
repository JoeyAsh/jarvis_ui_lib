import { Table } from 'jarvis-react-ui';
import type { TableColumn } from 'jarvis-react-ui';

interface Alert {
    id: string;
    level: string;
    message: string;
}

const COLUMNS: TableColumn<Alert>[] = [
    { key: 'level', header: 'Level', render: (r) => r.level },
    { key: 'message', header: 'Message', render: (r) => r.message },
];

export default function Empty() {
    return (
        <Table
            caption="Open alerts"
            columns={COLUMNS}
            rows={[]}
            getRowKey={(r) => r.id}
            emptyText="No open alerts. All systems nominal."
        />
    );
}
