import { Label, Metric } from 'jarvis-react-ui';

const READINGS = [
    { label: 'CPU', value: '42', unit: '%' },
    { label: 'Latency', value: '18', unit: 'ms' },
    { label: 'Altitude', value: '1,204', unit: 'm' },
    { label: 'Uptime', value: '73:12:05' },
];

export default function Units() {
    return (
        <div className="flex flex-wrap gap-8">
            {READINGS.map((r) => (
                <div key={r.label} className="flex flex-col gap-1">
                    <Label>{r.label}</Label>
                    <Metric value={r.value} unit={r.unit} />
                </div>
            ))}
        </div>
    );
}
