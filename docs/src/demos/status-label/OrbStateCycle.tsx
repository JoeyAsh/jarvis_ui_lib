import { useEffect, useState } from 'react';
import { StatusLabel, WaveformMeter } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

const CYCLE: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'follow_up', 'working'];

export default function OrbStateCycle() {
    const [index, setIndex] = useState(0);
    const state = CYCLE[index % CYCLE.length] ?? 'idle';
    const audible = state === 'listening' || state === 'speaking';

    useEffect(() => {
        const id = setInterval(() => setIndex((i) => i + 1), 1800);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex items-center gap-6">
            <WaveformMeter active={audible} />
            <StatusLabel state={state} />
            <WaveformMeter active={audible} mirrored />
        </div>
    );
}
