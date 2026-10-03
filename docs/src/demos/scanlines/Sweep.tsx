import { Scanlines } from 'jarvis-react-ui';

export default function Sweep() {
    return (
        <Scanlines sweep className="w-[260px] border border-border bg-surface px-6 py-4">
            <div className="text-[10px] uppercase tracking-[1px] text-accent">Receiving data…</div>
        </Scanlines>
    );
}
