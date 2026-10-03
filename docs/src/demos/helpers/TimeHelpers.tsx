import { useEffect, useState } from 'react';
import { cx, formatAge, formatDuration, formatTime, relativeTime, Table } from 'jarvis-react-ui';
import type { TableColumn } from 'jarvis-react-ui';

interface Row {
    call: string;
    result: string;
}

const COLUMNS: TableColumn<Row>[] = [
    { key: 'call', header: 'Call', render: (r) => <code className="text-accent">{r.call}</code> },
    { key: 'result', header: 'Result', render: (r) => <code>{r.result}</code> },
];

export default function TimeHelpers() {
    const [bootedAt] = useState(() => new Date().toISOString());
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const uptime = now.getTime() - new Date(bootedAt).getTime();
    const rows: Row[] = [
        { call: 'formatTime(bootedAt)', result: formatTime(bootedAt) },
        { call: 'relativeTime(bootedAt)', result: relativeTime(bootedAt) },
        { call: 'formatAge(bootedAt, now)', result: formatAge(bootedAt, now) },
        { call: 'formatDuration(uptime)', result: formatDuration(uptime) },
        { call: "cx('a', uptime > 5000 && 'b')", result: cx('a', uptime > 5000 && 'b') },
    ];

    return <Table columns={COLUMNS} rows={rows} getRowKey={(r) => r.call} dense />;
}
