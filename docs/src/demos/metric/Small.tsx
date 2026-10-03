import { Label, Metric } from 'jarvis-react-ui';

const ROWS = [
    { label: 'Packets in', value: '12,480', unit: '/s' },
    { label: 'Packets out', value: '9,312', unit: '/s' },
    { label: 'Dropped', value: '214', unit: '/s', warn: true },
];

export default function Small() {
    return (
        <dl className="flex w-full max-w-[240px] flex-col gap-1">
            {ROWS.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between">
                    <dt>
                        <Label>{r.label}</Label>
                    </dt>
                    <dd>
                        <Metric value={r.value} unit={r.unit} warn={r.warn} small />
                    </dd>
                </div>
            ))}
        </dl>
    );
}
