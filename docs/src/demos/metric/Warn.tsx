import { Label, Metric } from 'jarvis-react-ui';

const READINGS = [
    { label: 'Core temp', value: 64, unit: '°C', limit: 80 },
    { label: 'Hull stress', value: 91, unit: '%', limit: 75 },
];

export default function Warn() {
    return (
        <div className="flex gap-8">
            {READINGS.map((r) => (
                <div key={r.label} className="flex flex-col gap-1">
                    <Label>{r.label}</Label>
                    <Metric value={r.value} unit={r.unit} warn={r.value > r.limit} />
                </div>
            ))}
        </div>
    );
}
