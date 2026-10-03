import { Label, Pill } from 'jarvis-react-ui';

const SUBSYSTEMS = [
    { name: 'Repulsors', status: 'Armed', variant: 'ok' },
    { name: 'Life support', status: 'Nominal', variant: 'ok' },
    { name: 'Uplink', status: 'Lagging', variant: 'warn' },
    { name: 'Flight control', status: 'Fault', variant: 'err' },
] as const;

export default function StatusList() {
    return (
        <ul className="flex w-full max-w-[280px] flex-col gap-2">
            {SUBSYSTEMS.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                    <Label>{s.name}</Label>
                    <Pill variant={s.variant}>{s.status}</Pill>
                </li>
            ))}
        </ul>
    );
}
