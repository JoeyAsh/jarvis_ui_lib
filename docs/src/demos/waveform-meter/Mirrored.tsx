import { WaveformMeter } from 'jarvis-react-ui';

export default function Mirrored() {
    return (
        <div className="flex items-center gap-4">
            <WaveformMeter />
            <span className="text-[10px] uppercase tracking-[2px] text-accent-bright">
                Voice in
            </span>
            <WaveformMeter mirrored />
        </div>
    );
}
