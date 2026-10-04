import { useEffect, useState, type MouseEvent, type ReactElement } from 'react';
import { GridBackground } from '../primitives/GridBackground';
import { BrandMark } from '../primitives/BrandMark';
import { Switch } from '../primitives/Switch';
import { Divider } from '../primitives/Divider';
import { NavList } from '../compositions/NavList';
import type { NavListItem } from '../compositions/NavList';
import { useJarvis } from '../compositions/JarvisProvider';
import { OverviewSection } from './sections/OverviewSection';
import { HUDShellSection } from './sections/HUDShellSection';
import { TokensSection } from './sections/TokensSection';
import { PrimitivesTextSection } from './sections/PrimitivesTextSection';
import { PrimitivesChromeSection } from './sections/PrimitivesChromeSection';
import { PrimitivesInteractiveSection } from './sections/PrimitivesInteractiveSection';
import { PrimitivesControlsSection } from './sections/PrimitivesControlsSection';
import { FormsSection } from './sections/FormsSection';
import { MediaSection } from './sections/MediaSection';
import { OrbSection } from './sections/OrbSection';
import { CompositionsSection } from './sections/CompositionsSection';
import { CompositionsLayoutSection } from './sections/CompositionsLayoutSection';
import { ChartsSection } from './sections/ChartsSection';
import { WindowsSection } from './sections/WindowsSection';
import { DevOverlaysSection } from './sections/DevOverlaysSection';
import type { NavItem } from './Showcase.types';
import { buildNavGroups, findActiveSection } from './Showcase.utils';
import { ACTIVE_SECTION_OFFSET } from './constants';
import packageJson from '../../../package.json';

const NAV: NavItem[] = [
    { id: 'overview', label: 'OVERVIEW', group: null },
    { id: 'hud-shell', label: 'HUD SHELL', group: null },
    { id: 'tokens', label: 'TOKENS', group: 'TOKENS' },
    { id: 'primitives-text', label: 'TEXT & DATA', group: 'PRIMITIVES' },
    { id: 'chrome', label: 'CHROME', group: 'PRIMITIVES' },
    { id: 'primitives-interactive', label: 'INTERACTIVE', group: 'PRIMITIVES' },
    { id: 'primitives-controls', label: 'CONTROLS', group: 'PRIMITIVES' },
    { id: 'forms', label: 'FORMS', group: 'PRIMITIVES' },
    { id: 'orb', label: 'ORB', group: 'PRIMITIVES' },
    { id: 'compositions', label: 'COMPOSITIONS', group: 'COMPOSITIONS' },
    { id: 'compositions-layout', label: 'LAYOUT', group: 'COMPOSITIONS' },
    { id: 'charts', label: 'CHARTS', group: 'COMPOSITIONS' },
    { id: 'media', label: 'MEDIA', group: 'COMPOSITIONS' },
    { id: 'windows', label: 'WINDOWS', group: 'COMPOSITIONS' },
    { id: 'dev-overlays', label: 'DEV TOOLS', group: 'DEV' },
];

const NAV_GROUPS = buildNavGroups(NAV);
const NAV_IDS = NAV.map((item) => item.id);

/* ---- Showcase root ---- */

export function Showcase(): ReactElement {
    const [activeSection, setActiveSection] = useState<string>('overview');
    const { isMuted, toggleMute } = useJarvis();

    // Keep the nav highlight in sync with the scroll position.
    useEffect(() => {
        let frame = 0;
        function update(): void {
            frame = 0;
            const id = findActiveSection(NAV_IDS, ACTIVE_SECTION_OFFSET);
            if (id) setActiveSection(id);
        }
        function onScroll(): void {
            if (frame === 0) frame = requestAnimationFrame(update);
        }
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (frame !== 0) cancelAnimationFrame(frame);
        };
    }, []);

    function handleNavClick(item: NavListItem, e: MouseEvent<HTMLAnchorElement>): void {
        const el = document.getElementById(item.id);
        if (!el) return;
        e.preventDefault();
        setActiveSection(item.id);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${item.id}`);
    }

    function handleMuteChange(on: boolean): void {
        if (on === isMuted) toggleMute();
    }

    return (
        <div className="min-h-screen bg-bg text-text font-mono relative">
            {/* Page-level backdrop (intentionally fixed to the viewport) */}
            <GridBackground />

            {/* Sidebar nav: static block on narrow screens, fixed column from md up */}
            <aside className="relative z-[30] flex flex-col gap-4 p-3 border-b border-border bg-[rgba(5,5,8,0.88)] backdrop-blur-[12px] md:fixed md:inset-y-0 md:left-0 md:w-[148px] md:border-b-0 md:border-r md:overflow-y-auto">
                <BrandMark />

                <NavList
                    aria-label="Showcase sections"
                    groups={NAV_GROUPS}
                    activeId={activeSection}
                    onItemClick={handleNavClick}
                />

                <div className="mt-auto flex flex-col gap-2">
                    <Divider />
                    <Switch
                        size="sm"
                        label="SFX"
                        checked={!isMuted}
                        onCheckedChange={handleMuteChange}
                    />
                    <span className="text-[8px] text-text-muted uppercase tracking-[1px]">
                        v{packageJson.version}
                    </span>
                </div>
            </aside>

            {/* Main content */}
            <main className="relative z-[1] flex flex-col gap-16 p-4 md:ml-[148px] md:p-8">
                <OverviewSection />
                <HUDShellSection />
                <TokensSection />
                <PrimitivesTextSection />
                <PrimitivesChromeSection />
                <PrimitivesInteractiveSection />
                <PrimitivesControlsSection />
                <FormsSection />
                <OrbSection />
                <CompositionsSection />
                <CompositionsLayoutSection />
                <ChartsSection />
                <MediaSection />
                <WindowsSection />
                <DevOverlaysSection />
            </main>
        </div>
    );
}

export default Showcase;
