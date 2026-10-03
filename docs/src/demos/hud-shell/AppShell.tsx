import { useState } from 'react';
import {
    BrandMark,
    CssOrb,
    HUDShell,
    Metric,
    Panel,
    StatusBadge,
    StatusDock,
    TopBar,
} from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

export default function AppShell() {
    const [state, setState] = useState<AppOrbState>('idle');

    return (
        <HUDShell
            topbar={<TopBar left={<BrandMark />} right={<StatusBadge />} />}
            orb={<CssOrb state={state} particles={false} className="scale-[0.6]" />}
            dock={
                <StatusDock
                    state={state}
                    onPTT={() => setState((s) => (s === 'idle' ? 'listening' : 'idle'))}
                />
            }
        >
            <div className="flex justify-between px-5 pt-16">
                <Panel title="Vitals" className="w-[180px]">
                    <Metric value={42} unit="%" />
                </Panel>
                <Panel title="Agenda" className="w-[180px]">
                    <span className="text-text-secondary">10:30 · Briefing</span>
                </Panel>
            </div>
        </HUDShell>
    );
}
