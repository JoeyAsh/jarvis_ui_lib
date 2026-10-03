import { useState } from 'react';
import { CssOrb, Switch, TWEAKS_DEFAULTS } from 'jarvis-react-ui';
import type { TweaksState } from 'jarvis-react-ui';

export default function FeatureFlags() {
    const [tweaks, setTweaks] = useState<TweaksState>(TWEAKS_DEFAULTS);

    return (
        <div className="flex w-full flex-col items-center gap-3">
            <div className="flex gap-4">
                <Switch
                    label="Rings"
                    checked={tweaks.rings}
                    onCheckedChange={(rings) => setTweaks({ ...tweaks, rings })}
                />
                <Switch
                    label="Particles"
                    checked={tweaks.particles}
                    onCheckedChange={(particles) => setTweaks({ ...tweaks, particles })}
                />
            </div>
            <div className="relative h-[260px] w-full overflow-hidden">
                <CssOrb state="idle" rings={tweaks.rings} particles={tweaks.particles} />
            </div>
        </div>
    );
}
