import { useState } from 'react';
import { StatusDock } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function Basic() {
    const [state, setState] = useState<AppOrbState>('idle');

    return (
        <StatusDock
            state={state}
            onPTT={() => setState((s) => (s === 'idle' ? 'listening' : 'idle'))}
        />
    );
}
