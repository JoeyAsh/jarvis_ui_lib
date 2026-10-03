import { useEffect, useState } from 'react';
import { PushToTalkButton, StatusLabel, WaveformMeter } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

/** States that advance on their own: [next state, delay in ms]. */
const AUTO_NEXT: Partial<Record<AppOrbState, [AppOrbState, number]>> = {
    thinking: ['speaking', 1200],
    speaking: ['idle', 2400],
};

export default function VoiceLoop() {
    const [state, setState] = useState<AppOrbState>('idle');

    useEffect(() => {
        const next = AUTO_NEXT[state];
        if (next === undefined) return;
        const id = setTimeout(() => setState(next[0]), next[1]);
        return () => clearTimeout(id);
    }, [state]);

    function handleClick() {
        setState((s) => (s === 'idle' ? 'listening' : s === 'listening' ? 'thinking' : s));
    }

    const audible = state === 'listening' || state === 'speaking';

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-6">
                <WaveformMeter active={audible} />
                <PushToTalkButton active={state === 'listening'} onClick={handleClick} />
                <WaveformMeter active={audible} mirrored />
            </div>
            <StatusLabel state={state} />
        </div>
    );
}
