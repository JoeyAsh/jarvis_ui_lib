import { WaveformMeter } from 'jarvis-react-ui';

export default function BarCount() {
    return (
        <div className="flex items-end gap-8">
            <WaveformMeter barCount={6} />
            <WaveformMeter />
            <WaveformMeter barCount={24} />
        </div>
    );
}
