import { useMemo, useState } from 'react';
import { Callout, Grid, Panel, Textarea } from 'jarvis-react-ui';
import { UiRenderer, validateUiSpec } from 'jarvis-react-ui/generative';
import type { UiWindowSpec } from 'jarvis-react-ui/generative';

const START = JSON.stringify(
    {
        id: 'scan',
        title: 'Scan',
        state: { radius: 200, live: true },
        root: {
            type: 'Stack',
            children: [
                {
                    type: 'Slider',
                    props: {
                        label: 'Radius',
                        min: 50,
                        max: 500,
                        step: 50,
                        value: { $bind: 'radius' },
                        showValue: true,
                        formatValue: '{value} m',
                    },
                },
                { type: 'Switch', props: { label: 'Live', checked: { $bind: 'live' } } },
                {
                    type: 'Pill',
                    props: { variant: 'ok' },
                    children: 'scanning {{radius}} m',
                    visibleIf: { state: 'live' },
                },
            ],
        },
    },
    null,
    2,
);

export default function Playground() {
    const [text, setText] = useState(START);

    const result = useMemo(() => {
        try {
            const spec: unknown = JSON.parse(text);
            const validation = validateUiSpec(spec);
            return validation.ok
                ? { spec: spec as UiWindowSpec, errors: [] }
                : { spec: null, errors: validation.errors.map((e) => `${e.path}: ${e.message}`) };
        } catch (error) {
            return { spec: null, errors: [`Invalid JSON: ${String(error)}`] };
        }
    }, [text]);

    return (
        <Grid columns={2} gap="md" align="start" className="w-full">
            <Textarea
                aria-label="Spec JSON"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={18}
                fullWidth
                size="sm"
                spellCheck={false}
            />
            {result.spec !== null ? (
                <Panel title={result.spec.title} className="w-full">
                    <UiRenderer key={text} spec={result.spec} />
                </Panel>
            ) : (
                <Callout variant="error" title="Spec rejected">
                    {result.errors.join('\n')}
                </Callout>
            )}
        </Grid>
    );
}
