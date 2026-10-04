import { UiRenderer } from 'jarvis-react-ui/generative';
import type { UiWindowSpec } from 'jarvis-react-ui/generative';

// The kind of JSON an assistant returns when asked for "a volume control".
const SPEC: UiWindowSpec = {
    id: 'volume',
    state: { volume: 40, muted: false },
    root: {
        type: 'Stack',
        props: { gap: 'md' },
        children: [
            {
                type: 'Slider',
                props: {
                    label: 'Volume',
                    value: { $bind: 'volume' },
                    showValue: true,
                    formatValue: '{value} %',
                },
            },
            { type: 'Switch', props: { label: 'Mute', checked: { $bind: 'muted' } } },
            {
                type: 'Pill',
                props: { variant: 'warn' },
                children: 'Muted',
                visibleIf: { state: 'muted' },
            },
            {
                type: 'Mono',
                children: 'Output at {{volume}} %',
                visibleIf: { state: 'muted', eq: false },
            },
        ],
    },
};

export default function Basic() {
    return <UiRenderer spec={SPEC} />;
}
