import { useState, type ReactElement } from 'react';
import type { AppOrbState } from '@common/types';
import { GlassCard } from '../../compositions/GlassCard';
import { StatusBadge } from '../../compositions/StatusBadge';
import { StatusDock } from '../../compositions/StatusDock';
import { Panel } from '../../primitives/Panel';
import { TopBar } from '../../primitives/TopBar';
import { BrandMark } from '../../primitives/BrandMark';
import { StateSimulator } from '../../primitives/StateSimulator';
import { Label } from '../../primitives/Label';
import { Metric } from '../../primitives/Metric';
import { Divider } from '../../primitives/Divider';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

const VITALS = ['CPU', 'RAM', 'GPU', 'TEMP'];
const GERMAN_LABELS: Partial<Record<AppOrbState, string>> = {
    idle: 'BEREIT',
    listening: 'hört zu …',
    thinking: 'denkt nach …',
    speaking: 'spricht …',
    follow_up: 'Rückfrage …',
    working: 'arbeitet …',
};

export function CompositionsSection(): ReactElement {
    const [dockState, setDockState] = useState<AppOrbState>('idle');
    const [focusedId, setFocusedId] = useState<string>('focused');

    return (
        <section id="compositions" className="flex flex-col gap-4">
            <SectionHeader title="Compositions · Cards & HUD bars">
                GlassCard · StatusBadge · Panel · TopBar · StatusDock. TopBar and StatusDock are
                fixed to the viewport in production and scoped to their cards here.
            </SectionHeader>

            <Divider label="GlassCard · StatusBadge" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ShowcaseCard
                    label="GLASS CARD DEFAULT"
                    code={`<GlassCard title="SYSTEM">\n  …\n</GlassCard>`}
                >
                    <GlassCard title="SYSTEM">
                        <Label dim>CPU · 42%</Label>
                    </GlassCard>
                </ShowcaseCard>
                <ShowcaseCard
                    label="GLASS CARD FOCUSED"
                    code={`<GlassCard title="FOCUSED" focused>\n  …\n</GlassCard>`}
                >
                    <GlassCard title="FOCUSED" focused>
                        <Label>Active · cornerBreath · bloom</Label>
                    </GlassCard>
                </ShowcaseCard>
                <ShowcaseCard
                    label="STATUS BADGE VARIANTS"
                    code={`<StatusBadge state="online" label="LINK · SECURE" pulse />\n<StatusBadge state="warn" label="DEGRADED" />\n<StatusBadge state="offline" label="OFFLINE" />`}
                >
                    <div className="flex flex-wrap gap-4 justify-center">
                        <StatusBadge state="online" label="LINK · SECURE" pulse />
                        <StatusBadge state="warn" label="DEGRADED" />
                        <StatusBadge state="offline" label="OFFLINE" />
                    </div>
                </ShowcaseCard>
            </div>

            <Divider label="Panel (click to focus)" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ShowcaseCard
                    label="PANEL AT REST"
                    code={`<Panel title="Panel · Rest" onFocus={focus}>\n  …\n</Panel>`}
                    dark
                >
                    <Panel
                        title="Panel · Rest"
                        className="h-[100px] w-full max-w-[280px]"
                        focused={focusedId === 'rest'}
                        onFocus={() => setFocusedId('rest')}
                    >
                        <Label dim>Hover → brackets grow · click → focus</Label>
                    </Panel>
                </ShowcaseCard>
                <ShowcaseCard
                    label="PANEL FOCUSED"
                    code={`<Panel title="Panel · Focused" focused>\n  …\n</Panel>`}
                    dark
                >
                    <Panel
                        title="Panel · Focused"
                        className="h-[100px] w-full max-w-[280px]"
                        focused={focusedId === 'focused'}
                        onFocus={() => setFocusedId('focused')}
                    >
                        <Label>Accent border · shimmer · bloom</Label>
                    </Panel>
                </ShowcaseCard>
                <ShowcaseCard
                    label="PANEL FULL HEADER"
                    code={`<Panel ix="◈" title="Vitals" badge="LIVE">\n  …\n</Panel>`}
                    dark
                >
                    <Panel
                        ix="◈"
                        title="Vitals"
                        badge="LIVE"
                        className="w-full max-w-[280px]"
                        focused={focusedId === 'vitals'}
                        onFocus={() => setFocusedId('vitals')}
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {VITALS.map((label) => (
                                <div key={label} className="border border-border px-2 py-1">
                                    <Label>{label}</Label>
                                    <Metric value={42} unit="%" />
                                </div>
                            ))}
                        </div>
                    </Panel>
                </ShowcaseCard>
            </div>

            <Divider label="TopBar · StatusDock (scoped)" />
            <div className="grid grid-cols-1 gap-3">
                <ShowcaseCard
                    label="TOP BAR (fixed, scoped)"
                    code={`<TopBar\n  left={<Label>09:04:17 · LINK · SECURE</Label>}\n  center={<Label>MK XLII</Label>}\n  right={<BrandMark />}\n/>`}
                    dark
                >
                    {/* transform-gpu makes this box the containing block for the fixed bar */}
                    <div className="relative h-[72px] w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <TopBar
                            left={<Label>09:04:17 · LINK · SECURE</Label>}
                            center={<Label>MK XLII</Label>}
                            right={<BrandMark />}
                        />
                    </div>
                </ShowcaseCard>
                <ShowcaseCard
                    label="STATUS DOCK (fixed, scoped)"
                    code={`<StatusDock state={state} onPTT={toggleListening} />`}
                    dark
                >
                    <div className="flex w-full flex-col gap-3">
                        <StateSimulator
                            state={dockState}
                            onChange={setDockState}
                            position="inline"
                        />
                        <div className="relative h-[170px] w-full overflow-hidden border border-border bg-bg transform-gpu">
                            <StatusDock
                                state={dockState}
                                onPTT={() =>
                                    setDockState((s) => (s === 'idle' ? 'listening' : 'idle'))
                                }
                            />
                        </div>
                    </div>
                </ShowcaseCard>
                <ShowcaseCard
                    label="STATUS DOCK · LOCALIZED (labels, brand, pttLabel)"
                    code={`<StatusDock\n  state={state}\n  labels={{ idle: 'BEREIT', listening: 'hört zu …', thinking: 'denkt nach …' }}\n  brand="J A R V I S"\n  pttLabel="Sprechen"\n/>`}
                    dark
                >
                    <div className="relative h-[170px] w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <StatusDock
                            state={dockState}
                            labels={GERMAN_LABELS}
                            brand="J A R V I S"
                            pttLabel="Sprechen"
                            onPTT={() => setDockState((s) => (s === 'idle' ? 'listening' : 'idle'))}
                        />
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default CompositionsSection;
