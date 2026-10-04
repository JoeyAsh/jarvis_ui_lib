import { Suspense, lazy } from 'react';
import { HUDShell } from 'jarvis-react-ui';

const ThreeOrb = lazy(() => import('jarvis-react-ui/orb').then((m) => ({ default: m.ThreeOrb })));

export default function OverScene() {
    return (
        <HUDShell
            orb={
                <Suspense fallback={null}>
                    {/* The canvas is transparent: grid, stars and horizon stay visible. */}
                    <ThreeOrb state="idle" variant="particle" className="h-full! w-full!" />
                </Suspense>
            }
        />
    );
}
