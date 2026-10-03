import { Suspense, lazy, useState, type ReactElement } from 'react';
import type { AppOrbState } from '@common/types';
import { CssOrb } from '../../orb/CssOrb';
import { StateSimulator } from '../../primitives/StateSimulator';
import { Switch } from '../../primitives/Switch';
import { GridBackground } from '../../primitives/GridBackground';
import { Label } from '../../primitives/Label';
import { Button } from '../../primitives/Button';
import { ORB_VARIANTS } from '../../orb/variants/constants';
import type { ThreeOrbVariant } from '../../orb/ThreeOrb';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

const ALL_STATES: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'working'];
const THREE_VARIANTS: ThreeOrbVariant[] = ['constellation', ...ORB_VARIANTS];

// Three.js stays in its own chunk.
const ThreeOrb = lazy(() => import('../../orb/ThreeOrb'));

export function OrbSection(): ReactElement {
    const [liveState, setLiveState] = useState<AppOrbState>('idle');
    const [rings, setRings] = useState(true);
    const [particles, setParticles] = useState(true);
    const [threeVariant, setThreeVariant] = useState<ThreeOrbVariant>('particle');

    const code = `<CssOrb state="${liveState}"${rings ? '' : ' rings={false}'}${particles ? '' : ' particles={false}'} />`;

    return (
        <section id="orb" className="flex flex-col gap-4">
            <SectionHeader title="Orb">
                CssOrb · 5 states · pulse rings (listening) · rAF-driven particles · reduced-motion
                aware. ThreeOrb · 6 WebGL variants (drag to rotate, scroll to zoom). The state
                frames below are scaled down; the live demo renders at full size.
            </SectionHeader>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                {ALL_STATES.map((s) => (
                    <ShowcaseCard key={s} label={s} code={`<CssOrb state="${s}" />`} dark>
                        <div className="relative aspect-square w-full overflow-hidden border border-border bg-bg">
                            <div className="absolute inset-0 scale-[0.4]">
                                <CssOrb state={s} />
                            </div>
                        </div>
                    </ShowcaseCard>
                ))}
            </div>

            <ShowcaseCard label="LIVE DEMO (full size)" code={code} dark>
                <div className="flex w-full flex-col gap-3">
                    <StateSimulator state={liveState} onChange={setLiveState} position="inline" />
                    <div className="flex flex-wrap items-center gap-4">
                        <Switch label="Rings" checked={rings} onCheckedChange={setRings} />
                        <Switch
                            label="Particles"
                            checked={particles}
                            onCheckedChange={setParticles}
                        />
                        <Label dim>state · {liveState}</Label>
                    </div>
                    {/* transform-gpu scopes the fixed GridBackground to the stage */}
                    <div className="relative h-[760px] w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <GridBackground />
                        <CssOrb state={liveState} rings={rings} particles={particles} />
                    </div>
                </div>
            </ShowcaseCard>

            <ShowcaseCard
                label="THREE ORB · VARIANTS"
                code={`<ThreeOrb state="${liveState}" variant="${threeVariant}" fill="container" interactive />`}
                dark
            >
                <div className="flex w-full flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {THREE_VARIANTS.map((v) => (
                            <Button
                                key={v}
                                size="sm"
                                variant={v === threeVariant ? 'primary' : 'ghost'}
                                aria-pressed={v === threeVariant}
                                onClick={() => setThreeVariant(v)}
                            >
                                {v}
                            </Button>
                        ))}
                        <Label dim>state · {liveState} (live demo simulator)</Label>
                    </div>
                    <div className="relative h-[560px] w-full border border-border bg-bg">
                        <Suspense fallback={null}>
                            <ThreeOrb
                                state={liveState}
                                variant={threeVariant}
                                fill="container"
                                interactive
                            />
                        </Suspense>
                    </div>
                </div>
            </ShowcaseCard>
        </section>
    );
}

export default OrbSection;
