import type { ReactElement } from 'react';
import { CornerBrackets } from '../../primitives/CornerBrackets';
import { Scanlines } from '../../primitives/Scanlines';
import { GridBackground } from '../../primitives/GridBackground';
import { GlowFrame } from '../../primitives/GlowFrame';
import { Reticle } from '../../primitives/Reticle';
import { LightTrace } from '../../primitives/LightTrace';
import { PanelBloom } from '../../primitives/PanelBloom';
import { PanelRails } from '../../primitives/PanelRails';
import { StarField } from '../../primitives/StarField';
import { Reactor } from '../../primitives/Reactor';
import { ViewportCorners } from '../../primitives/ViewportCorners';
import { Scene } from '../../primitives/Scene';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

export function PrimitivesChromeSection(): ReactElement {
    return (
        <section id="chrome" className="flex flex-col gap-4">
            <SectionHeader title="Primitives · Chrome">
                CornerBrackets · LightTrace · PanelBloom · PanelRails · Scanlines · GridBackground ·
                GlowFrame · Reticle · ViewportCorners · StarField · Reactor · Scene
            </SectionHeader>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {/* CornerBrackets default */}
                <ShowcaseCard
                    label="CORNER BRACKETS"
                    code={`<CornerBrackets>\n  <div>content</div>\n</CornerBrackets>`}
                >
                    <CornerBrackets className="p-4">
                        <div className="border border-border px-6 py-4 text-[10px] text-text-secondary font-mono">
                            CPU · 42%
                        </div>
                    </CornerBrackets>
                </ShowcaseCard>

                {/* CornerBrackets focused */}
                <ShowcaseCard
                    label="CORNER FOCUSED"
                    code={`<CornerBrackets focused>\n  …\n</CornerBrackets>`}
                >
                    <CornerBrackets focused className="p-4">
                        <div className="border border-border px-6 py-4 text-[10px] text-accent font-mono">
                            FOCUSED
                        </div>
                    </CornerBrackets>
                </ShowcaseCard>

                {/* LightTrace */}
                <ShowcaseCard label="LIGHT TRACE" code={`<LightTrace />`} dark>
                    <div className="relative h-10 w-full overflow-hidden border border-border">
                        <LightTrace />
                    </div>
                </ShowcaseCard>

                {/* PanelBloom */}
                <ShowcaseCard label="PANEL BLOOM (active)" code={`<PanelBloom active />`} dark>
                    <div className="relative h-[60px] w-full border border-accent">
                        <PanelBloom active />
                        <span className="relative z-10 text-[9px] text-accent font-mono flex items-center justify-center h-full uppercase tracking-[1px]">
                            bloom active
                        </span>
                    </div>
                </ShowcaseCard>

                {/* PanelRails */}
                <ShowcaseCard label="PANEL RAILS" code={`<PanelRails visible />`} dark>
                    <div className="relative h-[60px] w-full border border-border">
                        <PanelRails visible />
                        <span className="relative z-10 text-[9px] text-text-secondary font-mono flex items-center justify-center h-full uppercase tracking-[1px]">
                            rails
                        </span>
                    </div>
                </ShowcaseCard>

                {/* Scanlines */}
                <ShowcaseCard
                    label="SCANLINES"
                    code={`<Scanlines sweep>\n  <div>content</div>\n</Scanlines>`}
                >
                    <Scanlines sweep className="border border-border px-6 py-4 w-full">
                        <div className="text-[10px] text-text-secondary font-mono uppercase tracking-[1px]">
                            NET · 12.3 Mb/s
                        </div>
                    </Scanlines>
                </ShowcaseCard>

                {/* GlowFrame static */}
                <ShowcaseCard
                    label="GLOW FRAME STATIC"
                    code={`<GlowFrame strong>\n  …\n</GlowFrame>`}
                >
                    <GlowFrame strong className="px-6 py-4">
                        <div className="text-[10px] text-accent font-mono">LISTENING…</div>
                    </GlowFrame>
                </ShowcaseCard>

                {/* GlowFrame breathe */}
                <ShowcaseCard
                    label="GLOW FRAME BREATHE"
                    code={`<GlowFrame breathe>\n  …\n</GlowFrame>`}
                >
                    <GlowFrame breathe className="px-6 py-4">
                        <div className="text-[22px] font-mono text-accent">●</div>
                    </GlowFrame>
                </ShowcaseCard>

                {/* Reticle sizes */}
                <ShowcaseCard label="RETICLE SIZES" code={`<Reticle size={16} />`}>
                    <div className="flex items-center gap-4">
                        <Reticle size={10} />
                        <Reticle size={14} />
                        <Reticle size={20} />
                    </div>
                </ShowcaseCard>

                {/* GridBackground — fixed layer, scoped by transform-gpu */}
                <ShowcaseCard
                    label="GRID BACKGROUND (drift)"
                    code={`<GridBackground drift gridSize={22} />`}
                    dark
                >
                    <div className="relative h-20 w-full overflow-hidden border border-border transform-gpu">
                        <GridBackground drift gridSize={22} />
                        <span className="relative z-10 text-[9px] text-text-muted font-mono uppercase tracking-[1px] flex items-center justify-center h-full">
                            faint grid underlay
                        </span>
                    </div>
                </ShowcaseCard>

                {/* StarField */}
                <ShowcaseCard label="STAR FIELD" code={`<StarField count={30} />`} dark>
                    <div className="relative h-20 w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <StarField count={30} />
                        <span className="relative z-10 text-[9px] text-text-muted font-mono uppercase tracking-[1px] flex items-center justify-center h-full">
                            star field
                        </span>
                    </div>
                </ShowcaseCard>

                {/* ViewportCorners — fixed marks, scoped by transform-gpu */}
                <ShowcaseCard label="VIEWPORT CORNERS" code={`<ViewportCorners />`} dark>
                    <div className="relative h-20 w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <ViewportCorners />
                        <span className="relative z-10 text-[9px] text-text-muted font-mono uppercase tracking-[1px] flex items-center justify-center h-full">
                            scoped · fixed to the viewport in production
                        </span>
                    </div>
                </ShowcaseCard>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {/* Reactor — fixed glow, scoped by transform-gpu */}
                <ShowcaseCard label="REACTOR (scoped)" code={`<Reactor />`} dark>
                    <div className="relative h-[600px] w-full overflow-hidden border border-border bg-bg transform-gpu">
                        <Reactor />
                        <span className="relative z-10 text-[9px] text-text-muted font-mono uppercase tracking-[1px] flex items-end justify-center pb-3 h-full">
                            ambient glow base under orb
                        </span>
                    </div>
                </ShowcaseCard>

                {/* Scene — fixed backdrop, scoped by transform-gpu */}
                <ShowcaseCard label="SCENE (scoped)" code={`<Scene starCount={20} />`} dark>
                    <div className="relative h-[600px] w-full overflow-hidden border border-border transform-gpu">
                        <Scene starCount={20} />
                        <span className="relative z-10 text-[9px] text-text-muted font-mono uppercase tracking-[1px] flex items-center justify-center h-full">
                            grid + stars + scanlines + vignette + horizon
                        </span>
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default PrimitivesChromeSection;
