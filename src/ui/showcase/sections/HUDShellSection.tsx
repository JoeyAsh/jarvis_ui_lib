import { useState, type ReactElement } from 'react';
import type { AppOrbState } from '@common/types';
import { HUDShell } from '../../compositions/HUDShell';
import { StatusDock } from '../../compositions/StatusDock';
import { TopBar } from '../../primitives/TopBar';
import { BrandMark } from '../../primitives/BrandMark';
import { Panel } from '../../primitives/Panel';
import { Label } from '../../primitives/Label';
import { Switch } from '../../primitives/Switch';
import { CssOrb } from '../../orb/CssOrb';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

export function HUDShellSection(): ReactElement {
    const [idle, setIdle] = useState(false);
    const [state, setState] = useState<AppOrbState>('idle');

    return (
        <section id="hud-shell" className="flex flex-col gap-4">
            <SectionHeader title="HUD Shell">
                HUDShell = Scene · Reactor · ViewportCorners · TopBar · Orb · panels · StatusDock.
                It is fixed to the viewport in production; here it is scoped to the preview box.
                Click the push-to-talk button to toggle listening.
            </SectionHeader>

            <ShowcaseCard
                label="HUD SHELL (scoped preview)"
                code={`<HUDShell\n  idle={idle}\n  topbar={<TopBar left={<BrandMark />} />}\n  orb={<CssOrb state={state} />}\n  dock={<StatusDock state={state} onPTT={toggle} />}\n>\n  <Panel title="SYSTEM">…</Panel>\n</HUDShell>`}
                dark
            >
                <div className="flex w-full flex-col gap-3">
                    <Switch label="Idle mode" checked={idle} onCheckedChange={setIdle} />
                    {/* transform-gpu makes this box the containing block for the fixed shell */}
                    <div className="relative h-[640px] w-full overflow-hidden border border-border transform-gpu">
                        <HUDShell
                            idle={idle}
                            topbar={
                                <TopBar
                                    left={<BrandMark />}
                                    center={<Label>HUD PREVIEW</Label>}
                                    right={<Label dim>N 48.21 · E 16.37</Label>}
                                />
                            }
                            orb={<CssOrb state={state} />}
                            dock={
                                <StatusDock
                                    state={state}
                                    onPTT={() =>
                                        setState((s) => (s === 'idle' ? 'listening' : 'idle'))
                                    }
                                />
                            }
                        >
                            <div className="absolute top-20 left-5 w-[220px]">
                                <Panel title="SYSTEM" ix="◈">
                                    <Label dim>CPU · RAM · UPTIME</Label>
                                </Panel>
                            </div>
                            <div className="absolute top-20 right-5 hidden w-[220px] md:block">
                                <Panel title="TRANSCRIPT" ix="▸">
                                    <Label dim>Awaiting input…</Label>
                                </Panel>
                            </div>
                        </HUDShell>
                    </div>
                </div>
            </ShowcaseCard>
        </section>
    );
}

export default HUDShellSection;
