import { useState, type ReactElement } from 'react';
import { UiRenderer } from '../../generative/UiRenderer';
import { CodeBlock } from '../../compositions/CodeBlock';
import { Panel } from '../../primitives/Panel';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';
import { DEMO_SPEC } from './GenerativeSection.constants';

export function GenerativeSection(): ReactElement {
    const [state, setState] = useState(DEMO_SPEC.state ?? {});
    const [lastAction, setLastAction] = useState('—');

    return (
        <section id="generative" className="flex flex-col gap-4">
            <SectionHeader title="Generative UI">
                UiRenderer · a JSON spec (left) rendered with library components (right), with
                bindings, templates, visibleIf and actions
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <ShowcaseCard label="SPEC" code={JSON.stringify(DEMO_SPEC, null, 2)} dark>
                    <CodeBlock
                        code={JSON.stringify(state, null, 2)}
                        language="json"
                        title="live state"
                        className="w-full"
                    />
                </ShowcaseCard>
                <ShowcaseCard
                    label="RENDERED"
                    code={`<UiRenderer spec={spec} onStateChange={setState} onAction={…} />`}
                    dark
                >
                    <div className="flex w-full flex-col gap-2">
                        <Panel title={DEMO_SPEC.title} className="w-full">
                            <UiRenderer
                                spec={DEMO_SPEC}
                                onStateChange={setState}
                                onAction={(e) =>
                                    setLastAction(`${e.name}(${JSON.stringify(e.payload)})`)
                                }
                            />
                        </Panel>
                        <span className="text-[10px] text-text-secondary">
                            last emit: {lastAction}
                        </span>
                    </div>
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default GenerativeSection;
