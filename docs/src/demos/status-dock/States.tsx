import { useState } from 'react';
import { Button, StatusDock } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

const STATES: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'working'];

export default function States() {
    const [state, setState] = useState<AppOrbState>('thinking');

    return (
        <>
            <div className="flex flex-wrap justify-center gap-2 self-start">
                {STATES.map((s) => (
                    <Button
                        key={s}
                        size="sm"
                        variant={state === s ? 'primary' : 'ghost'}
                        onClick={() => setState(s)}
                    >
                        {s}
                    </Button>
                ))}
            </div>
            <StatusDock state={state} />
        </>
    );
}
