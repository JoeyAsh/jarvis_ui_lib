import { Scanlines } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <Scanlines className="w-[260px] border border-border bg-surface px-6 py-4">
            <div className="text-[10px] uppercase tracking-[1px] text-text-secondary">
                NET · 12.3 Mb/s
            </div>
        </Scanlines>
    );
}
