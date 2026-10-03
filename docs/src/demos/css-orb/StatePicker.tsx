import { useState } from 'react';
import { CssOrb, StateSimulator, Switch } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function StatePicker() {
    const [state, setState] = useState<AppOrbState>('listening');
    const [rings, setRings] = useState(true);
    const [particles, setParticles] = useState(true);

    return (
        <div className="flex w-full flex-col items-center gap-3">
            <StateSimulator state={state} onChange={setState} position="inline" />
            <div className="flex gap-6">
                <Switch size="sm" label="Rings" checked={rings} onCheckedChange={setRings} />
                <Switch
                    size="sm"
                    label="Particles"
                    checked={particles}
                    onCheckedChange={setParticles}
                />
            </div>
            <div className="relative h-[260px] w-full overflow-hidden">
                <CssOrb state={state} rings={rings} particles={particles} />
            </div>
        </div>
    );
}
