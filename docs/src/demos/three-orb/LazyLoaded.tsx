import { Suspense, lazy, useState } from 'react';
import { Mono, StateSimulator } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

// Loads Three.js and the orb engine in their own chunk on first render.
const ThreeOrb = lazy(() => import('jarvis-react-ui/orb').then((m) => ({ default: m.ThreeOrb })));

export default function LazyLoaded() {
    const [state, setState] = useState<AppOrbState>('idle');

    return (
        <>
            <Suspense fallback={<Mono muted>Loading orb…</Mono>}>
                {/* The canvas is fixed and viewport-sized; here it is fitted to the demo frame. */}
                <ThreeOrb state={state} className="h-full! w-full!" />
            </Suspense>
            <StateSimulator
                state={state}
                onChange={setState}
                position="inline"
                className="relative z-10"
            />
        </>
    );
}
