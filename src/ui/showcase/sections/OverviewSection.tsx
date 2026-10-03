import type { ReactElement } from 'react';
import { CodeBlock } from '../../compositions/CodeBlock';
import { Callout } from '../../compositions/Callout';
import { SectionHeader } from '../SectionHeader';

const INSTALL = `npm install jarvis-react-ui

import 'jarvis-react-ui/style.css';
import { JarvisProvider, Button } from 'jarvis-react-ui';`;

export function OverviewSection(): ReactElement {
    return (
        <section id="overview" className="flex flex-col gap-4">
            <SectionHeader title="Overview">
                Internal showcase of jarvis-react-ui: React/TypeScript primitives, compositions,
                window system and orb for the JARVIS HUD visual language, built on the design tokens
                in tokens.css. Every public component has a live demo below; use the sidebar to jump
                between sections.
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <CodeBlock title="Quick start" language="tsx" code={INSTALL} />
                <Callout title="Dev playground">
                    This page is the internal visual test bed. The public documentation lives on the
                    docs site; fixed-position HUD pieces are scoped into preview boxes here.
                </Callout>
            </div>
        </section>
    );
}

export default OverviewSection;
