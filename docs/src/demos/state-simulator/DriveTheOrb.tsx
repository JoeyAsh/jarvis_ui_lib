import { useState } from 'react';
import { CssOrb, StateSimulator, StatusLabel } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function DriveTheOrb() {
    const [state, setState] = useState<AppOrbState>('thinking');

    return (
        <div className="flex w-full flex-col items-center gap-3">
            <StateSimulator state={state} onChange={setState} position="inline" />
            <div className="relative h-[260px] w-full overflow-hidden">
                <CssOrb state={state} particles />
            </div>
            <StatusLabel state={state} />
        </div>
    );
}
