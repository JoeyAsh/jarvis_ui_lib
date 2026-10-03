import { useState, type ReactElement } from 'react';
import { NavList } from '../../compositions/NavList';
import type { NavListGroup } from '../../compositions/NavList';
import { Tabs } from '../../compositions/Tabs';
import { Table } from '../../compositions/Table';
import type { TableColumn } from '../../compositions/Table';
import { CodeBlock } from '../../compositions/CodeBlock';
import { Callout } from '../../compositions/Callout';
import { TopBar } from '../../primitives/TopBar';
import { BrandMark } from '../../primitives/BrandMark';
import { Pill } from '../../primitives/Pill';
import { Button } from '../../primitives/Button';
import { ShowcaseCard } from '../ShowcaseCard';

interface DemoPropRow {
    name: string;
    type: string;
    def: string;
}

const NAV_GROUPS: NavListGroup[] = [
    { items: [{ id: 'overview', label: 'Overview', href: '#compositions-layout' }] },
    {
        label: 'Getting started',
        items: [
            { id: 'install', label: 'Installation', href: '#compositions-layout' },
            { id: 'usage', label: 'Usage', href: '#compositions-layout' },
        ],
    },
    {
        label: 'Components',
        items: [
            { id: 'button', label: 'Button', href: '#compositions-layout' },
            {
                id: 'tabs',
                label: 'Tabs',
                href: '#compositions-layout',
                badge: <Pill variant="info">NEW</Pill>,
            },
        ],
    },
];

const PROP_ROWS: DemoPropRow[] = [
    { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", def: "'secondary'" },
    { name: 'size', type: "'sm' | 'md'", def: "'md'" },
    { name: 'disabled', type: 'boolean', def: 'false' },
];

const PROP_COLUMNS: TableColumn<DemoPropRow>[] = [
    { key: 'name', header: 'Prop', render: (r) => <span className="text-accent">{r.name}</span> },
    { key: 'type', header: 'Type', render: (r) => <code className="text-text">{r.type}</code> },
    { key: 'def', header: 'Default', render: (r) => <code>{r.def}</code> },
];

const INSTALL = 'npm install jarvis-react-ui';

const HIGHLIGHTED = [
    '<span class="text-accent-bright">import</span> { Button } <span class="text-accent-bright">from</span> <span class="text-success">\'jarvis-react-ui\'</span>;',
].join('\n');

export function CompositionsLayoutSection(): ReactElement {
    const [activeNav, setActiveNav] = useState('button');

    return (
        <section id="compositions-layout" className="flex flex-col gap-4">
            <div>
                <h2 className="text-[12px] text-text font-mono mb-1">COMPOSITIONS — Layout</h2>
                <p className="text-[10px] text-text-secondary font-mono">
                    NavList · Tabs · Table · CodeBlock · Callout · TopBar position
                </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <ShowcaseCard
                    label="NAV LIST (click to activate)"
                    code={`<NavList\n  groups={groups}\n  activeId={active}\n  onItemClick={(item, e) => {\n    e.preventDefault();\n    setActive(item.id);\n  }}\n/>`}
                    dark
                >
                    <NavList
                        className="w-[200px]"
                        groups={NAV_GROUPS}
                        activeId={activeNav}
                        onItemClick={(item, e) => {
                            e.preventDefault();
                            setActiveNav(item.id);
                        }}
                    />
                </ShowcaseCard>

                <ShowcaseCard
                    label="TABS (arrow keys work)"
                    code={`<Tabs\n  aria-label="Install"\n  items={[\n    { value: 'npm', label: 'npm', content: … },\n    { value: 'pnpm', label: 'pnpm', content: … },\n    { value: 'yarn', label: 'yarn', content: … },\n  ]}\n/>`}
                    dark
                >
                    <Tabs
                        className="w-full"
                        aria-label="Install"
                        items={[
                            {
                                value: 'npm',
                                label: 'npm',
                                content: <CodeBlock code={INSTALL} copyable={false} />,
                            },
                            {
                                value: 'pnpm',
                                label: 'pnpm',
                                content: (
                                    <CodeBlock code="pnpm add jarvis-react-ui" copyable={false} />
                                ),
                            },
                            {
                                value: 'yarn',
                                label: 'yarn',
                                content: (
                                    <CodeBlock code="yarn add jarvis-react-ui" copyable={false} />
                                ),
                            },
                            { value: 'bun', label: 'bun', content: null, disabled: true },
                        ]}
                    />
                </ShowcaseCard>

                <ShowcaseCard
                    label="CODE BLOCK"
                    code={`<CodeBlock\n  title="App.tsx"\n  language="tsx"\n  code={source}\n  html={highlighted}\n/>`}
                    dark
                >
                    <CodeBlock
                        className="w-full"
                        title="App.tsx"
                        language="tsx"
                        code={"import { Button } from 'jarvis-react-ui';"}
                        html={HIGHLIGHTED}
                    />
                </ShowcaseCard>

                <ShowcaseCard
                    label="TABLE"
                    code={`<Table\n  caption="Button props"\n  columns={columns}\n  rows={rows}\n  getRowKey={(r) => r.name}\n/>`}
                    dark
                >
                    <Table
                        caption="Button props"
                        columns={PROP_COLUMNS}
                        rows={PROP_ROWS}
                        getRowKey={(r) => r.name}
                        dense
                    />
                </ShowcaseCard>

                <ShowcaseCard
                    label="CALLOUT VARIANTS"
                    code={`<Callout title="Note">…</Callout>\n<Callout variant="success">…</Callout>\n<Callout variant="warning" title="Heads up">…</Callout>\n<Callout variant="error">…</Callout>`}
                    dark
                >
                    <div className="flex flex-col gap-2 w-full">
                        <Callout title="Note">Import style.css once at the app root.</Callout>
                        <Callout variant="success">Sounds loaded.</Callout>
                        <Callout variant="warning" title="Heads up">
                            ThreeOrb needs the optional three peer.
                        </Callout>
                        <Callout variant="error">Audio context blocked.</Callout>
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="TOP BAR position=static"
                    code={`<TopBar\n  position="static"\n  left={<BrandMark />}\n  right={<Button size="sm">DOCS</Button>}\n/>`}
                    dark
                >
                    <TopBar
                        position="static"
                        left={<BrandMark />}
                        right={
                            <Button size="sm" variant="ghost">
                                DOCS
                            </Button>
                        }
                    />
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default CompositionsLayoutSection;
