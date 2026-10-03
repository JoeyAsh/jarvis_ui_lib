import { useEffect, useState } from 'react';
import { CssOrb, StatusLabel } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

const STATES: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'working'];

export default function Cycle() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setIndex((i) => (i + 1) % STATES.length), 3000);
        return () => clearInterval(timer);
    }, []);

    const state = STATES[index] ?? 'idle';

    return (
        <div className="relative h-[356px] w-full overflow-hidden">
            <CssOrb state={state} />
            <StatusLabel state={state} className="absolute bottom-0 left-1/2 -translate-x-1/2" />
        </div>
    );
}
