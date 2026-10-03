import { WaveformMeter } from 'jarvis-react-ui';

export default function ActiveInactive() {
    return (
        <>
            <WaveformMeter />
            <WaveformMeter active={false} />
        </>
    );
}
