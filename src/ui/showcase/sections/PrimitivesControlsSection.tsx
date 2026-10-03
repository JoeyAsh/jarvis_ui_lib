import { useState, type ReactElement } from 'react';
import { Copy, FileCode, Search, Volume2 } from 'lucide-react';
import { Input } from '../../primitives/Input';
import { IconButton } from '../../primitives/IconButton';
import { Tooltip } from '../../primitives/Tooltip';
import { Switch } from '../../primitives/Switch';
import { Divider } from '../../primitives/Divider';
import { Link } from '../../primitives/Link';
import { Hint } from '../../primitives/Hint';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

export function PrimitivesControlsSection(): ReactElement {
    const [query, setQuery] = useState('');
    const [sound, setSound] = useState(true);

    return (
        <section id="primitives-controls" className="flex flex-col gap-4">
            <SectionHeader title="Primitives · Controls">
                Input · IconButton · Tooltip · Switch · Divider · Link
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ShowcaseCard
                    label="INPUT WITH ADORNMENTS"
                    code={`<Input\n  placeholder="Search docs…"\n  startAdornment={<Search size={12} />}\n  endAdornment={<Hint.Key>CTRL K</Hint.Key>}\n/>`}
                    dark
                >
                    <Input
                        aria-label="Search docs"
                        placeholder="Search docs…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        startAdornment={<Search size={12} aria-hidden="true" />}
                        endAdornment={<Hint.Key>CTRL K</Hint.Key>}
                    />
                </ShowcaseCard>

                <ShowcaseCard
                    label="INPUT SM · INVALID · DISABLED"
                    code={`<Input size="sm" />\n<Input invalid />\n<Input disabled />`}
                    dark
                >
                    <div className="flex flex-col gap-2">
                        <Input aria-label="Small" size="sm" placeholder="size sm" />
                        <Input aria-label="Invalid" invalid defaultValue="#zz00ff" />
                        <Input aria-label="Disabled" disabled placeholder="disabled" />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="ICON BUTTON VARIANTS"
                    code={`<IconButton icon={Copy} label="Copy" />\n<IconButton icon={Copy} label="Copy" variant="secondary" />\n<IconButton icon={Copy} label="Copy" variant="primary" />\n<IconButton icon={Copy} label="Copy" variant="danger" size="sm" />`}
                    dark
                >
                    <div className="flex items-center gap-2">
                        <IconButton icon={Copy} label="Copy ghost" />
                        <IconButton icon={Copy} label="Copy secondary" variant="secondary" />
                        <IconButton icon={Copy} label="Copy primary" variant="primary" />
                        <IconButton icon={Copy} label="Copy danger" variant="danger" size="sm" />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="TOOLTIP (hover / focus)"
                    code={`<Tooltip content="Copy code">\n  <IconButton icon={Copy} label="Copy" />\n</Tooltip>`}
                    dark
                >
                    <div className="flex items-center gap-4">
                        <Tooltip content="Copy code">
                            <IconButton icon={Copy} label="Copy" />
                        </Tooltip>
                        <Tooltip content="View source" placement="bottom">
                            <IconButton icon={FileCode} label="Source" />
                        </Tooltip>
                        <Tooltip content="Sound" placement="right">
                            <IconButton icon={Volume2} label="Sound" />
                        </Tooltip>
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="SWITCH"
                    code={`<Switch label="Sound" checked={on} onCheckedChange={setOn} />\n<Switch size="sm" label="Compact" />\n<Switch label="Disabled" disabled />`}
                    dark
                >
                    <div className="flex flex-col gap-3">
                        <Switch label="Sound" checked={sound} onCheckedChange={setSound} />
                        <Switch size="sm" label="Compact" />
                        <Switch label="Disabled" disabled />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="DIVIDER"
                    code={`<Divider />\n<Divider variant="accent" />\n<Divider label="API" />\n<Divider orientation="vertical" />`}
                    dark
                >
                    <div className="flex flex-col gap-3 w-full">
                        <Divider />
                        <Divider variant="accent" />
                        <Divider label="API" />
                        <div className="flex items-center gap-3 h-[20px] text-[10px] text-text-secondary">
                            <span>LEFT</span>
                            <Divider orientation="vertical" />
                            <span>RIGHT</span>
                        </div>
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="LINK"
                    code={`<Link href="#">Inline link</Link>\n<Link href="#" variant="muted">Muted</Link>\n<Link href="#" variant="nav" active>Components</Link>\n<Link href="https://github.com" external>GitHub</Link>`}
                    dark
                >
                    <div className="flex flex-col gap-2 text-[11px]">
                        <Link href="#primitives-controls">Inline link</Link>
                        <Link href="#primitives-controls" variant="muted">
                            Muted
                        </Link>
                        <Link href="#primitives-controls" variant="nav" active>
                            Components
                        </Link>
                        <Link href="https://github.com/JoeyAsh/jarvis_ui_lib" external>
                            GitHub
                        </Link>
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default PrimitivesControlsSection;
