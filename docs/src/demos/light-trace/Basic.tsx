import { LightTrace } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="relative w-[280px] border border-border px-6 py-4">
            <LightTrace />
            <span className="text-[10px] text-text-secondary">Uplink active</span>
        </div>
    );
}
