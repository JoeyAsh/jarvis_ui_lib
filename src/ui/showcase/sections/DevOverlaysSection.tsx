import { useState, type ReactElement } from 'react';
import type { AppOrbState } from '@common/types';
import { StateSimulator } from '../../primitives/StateSimulator';
import { CssOrb } from '../../orb/CssOrb';
import { Switch } from '../../primitives/Switch';
import { Label } from '../../primitives/Label';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';
import { TweaksDemo } from './TweaksDemo';

export function DevOverlaysSection(): ReactElement {
    const [orbState, setOrbState] = useState<AppOrbState>('idle');
    const [tweaksOn, setTweaksOn] = useState(false);

    return (
        <section id="dev-overlays" className="flex flex-col gap-4">
            <SectionHeader title="Dev Tools">
                StateSimulator · Tweaks + useTweakApply. Both are fixed overlays by default; here
                StateSimulator runs inline and Tweaks is scoped to its stage. While enabled, Tweaks
                overrides the accent tokens of the whole page.
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3">
                <ShowcaseCard
                    label="STATE SIMULATOR (inline)"
                    code={`<StateSimulator state={state} onChange={setState} position="inline" />`}
                    dark
                >
                    <div className="flex w-full flex-col gap-3">
                        <StateSimulator state={orbState} onChange={setOrbState} position="inline" />
                        <div className="relative h-[480px] w-full overflow-hidden border border-border bg-bg">
                            <CssOrb state={orbState} />
                        </div>
                    </div>
                </ShowcaseCard>
                <ShowcaseCard
                    label="TWEAKS (scoped)"
                    code={`const [tweaks, setTweaks] = useState(TWEAKS_DEFAULTS);\nuseTweakApply(tweaks);\n<Tweaks open tweaks={tweaks} onChange={setTweaks} />`}
                    dark
                >
                    <div className="flex w-full flex-col gap-3">
                        <Switch
                            label="Enable Tweaks (recolors the page)"
                            checked={tweaksOn}
                            onCheckedChange={setTweaksOn}
                        />
                        {tweaksOn ? (
                            <TweaksDemo />
                        ) : (
                            <Label dim>Off — the page shows the default tokens.</Label>
                        )}
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default DevOverlaysSection;
