import { TopBar } from 'jarvis-react-ui';

const LINES = Array.from(
    { length: 12 },
    (_, i) => `LOG ${String(i + 1).padStart(2, '0')} · telemetry received`,
);

export default function Sticky() {
    return (
        <div className="h-[220px] w-full overflow-y-auto border border-border px-3 pb-3">
            <TopBar
                position="sticky"
                left={<span className="text-[11px] text-text">EVENT LOG</span>}
                right={<span className="text-[9px] text-text-muted">SCROLL ↓</span>}
            />
            <ul className="mt-4 flex flex-col gap-2 text-[11px] text-text-secondary">
                {LINES.map((line) => (
                    <li key={line}>{line}</li>
                ))}
            </ul>
        </div>
    );
}
