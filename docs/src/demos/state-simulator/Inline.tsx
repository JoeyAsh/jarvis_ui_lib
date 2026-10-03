import { useState } from 'react';
import { StateSimulator } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function Inline() {
    const [state, setState] = useState<AppOrbState>('idle');

    return (
        <div className="flex flex-col items-center gap-3">
            <StateSimulator state={state} onChange={setState} position="inline" />
            <span className="text-[10px] text-text-muted">state = {state}</span>
        </div>
    );
}
