import { useState } from 'react';
import { StateSimulator, StatusLabel } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function FixedTop() {
    const [state, setState] = useState<AppOrbState>('listening');

    return (
        <>
            {/* Pinned 60px below the top of the viewport (here: of the demo frame). */}
            <StateSimulator state={state} onChange={setState} />
            <StatusLabel state={state} />
        </>
    );
}
