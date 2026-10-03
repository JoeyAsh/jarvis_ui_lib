import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { AudioLines, Grid3x3, Orbit, Palette, ShieldCheck, Zap } from 'lucide-react';
import { Button, CornerBrackets, CssOrb, Panel, Pill } from '@ui';
import { DocsCodeBlock } from './DocsCodeBlock';
import type { AppOrbState } from '@common/types';
import { LANDING_FEATURES, ORB_CYCLE, ORB_CYCLE_MS } from './landingContent';

const FEATURE_ICONS = {
    grid: Grid3x3,
    orbit: Orbit,
    sound: AudioLines,
    palette: Palette,
    typed: ShieldCheck,
    light: Zap,
} as const;

export function Landing(): ReactElement {
    const navigate = useNavigate();
    const [orbState, setOrbState] = useState<AppOrbState>('idle');

    useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            i = (i + 1) % ORB_CYCLE.length;
            setOrbState(ORB_CYCLE[i] ?? 'idle');
        }, ORB_CYCLE_MS);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex flex-col gap-14 pt-4">
            <section className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
                <div className="flex flex-col items-start gap-5">
                    <Pill variant="info">React 19 · TypeScript · MIT</Pill>
                    <h1 className="m-0 text-[30px] sm:text-[38px] font-medium leading-[1.15] tracking-[1px] text-text">
                        HUD components
                        <br />
                        <span className="text-accent-bright">for React.</span>
                    </h1>
                    <p className="m-0 max-w-[460px] text-[13px] leading-[1.8] text-text-secondary">
                        Sharp, dark, JARVIS-style interface parts: primitives, compositions, a
                        snapping window grid and an animated orb. JetBrains Mono, glow instead of
                        shadows, and UI sound effects built in.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="primary"
                            onClick={() => void navigate('/getting-started/installation')}
                        >
                            Get started
                        </Button>
                        <Button onClick={() => void navigate('/components/button')}>
                            Browse components
                        </Button>
                    </div>
                </div>
                <CornerBrackets className="block">
                    <div className="relative h-[300px] overflow-hidden border border-border bg-[rgba(5,5,8,0.9)]">
                        <CssOrb state={orbState} particles />
                        <span className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[2px] text-text-secondary">
                            state · <span className="text-accent-bright">{orbState}</span>
                        </span>
                    </div>
                </CornerBrackets>
            </section>

            <section className="flex flex-col gap-3">
                <span className="text-[9px] uppercase tracking-[2px] text-text-secondary">
                    Install
                </span>
                <DocsCodeBlock
                    code="npm i jarvis-react-ui react react-dom lucide-react"
                    language="bash"
                />
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {LANDING_FEATURES.map((f) => {
                    const Icon = FEATURE_ICONS[f.icon];
                    return (
                        <Panel
                            key={f.title}
                            title={
                                <span className="inline-flex items-center gap-2">
                                    <Icon size={12} aria-hidden="true" /> {f.title}
                                </span>
                            }
                        >
                            <p className="m-0 text-[11px] leading-[1.7] text-text-secondary">
                                {f.text}
                            </p>
                        </Panel>
                    );
                })}
            </section>
        </div>
    );
}

export default Landing;
