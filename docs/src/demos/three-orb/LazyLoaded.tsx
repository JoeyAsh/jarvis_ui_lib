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
                {/* fill="container": fills the demo frame instead of the viewport. */}
                <div className="absolute inset-0">
                    <ThreeOrb state={state} fill="container" />
                </div>
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
