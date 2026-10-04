import type { UiWindowSpec } from '../../generative/spec.types';

/** A spec like an assistant would return for "a volume and scan control". */
export const DEMO_SPEC: UiWindowSpec = {
    id: 'demo',
    title: 'Audio & scan',
    state: { volume: 40, muted: false, mode: 'auto' },
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
                    fullWidth: true,
                },
            },
            { type: 'Switch', props: { label: 'Mute', checked: { $bind: 'muted' } } },
            {
                type: 'Select',
                props: {
                    'aria-label': 'Scan mode',
                    value: { $bind: 'mode' },
                    options: [
                        { value: 'auto', label: 'Auto scan' },
                        { value: 'manual', label: 'Manual' },
                    ],
                },
            },
            {
                type: 'Callout',
                props: { variant: 'warning', title: 'Muted' },
                children: 'Audio output is off.',
                visibleIf: { state: 'muted' },
            },
            {
                type: 'Stack',
                props: { direction: 'row', gap: 'sm', align: 'center' },
                children: [
                    { type: 'Pill', props: { variant: 'info' }, children: 'mode: {{mode}}' },
                    {
                        type: 'Button',
                        props: { variant: 'primary', size: 'sm' },
                        children: 'Apply',
                        on: {
                            onClick: {
                                emit: 'apply',
                                payload: { volume: { $state: 'volume' }, mode: { $state: 'mode' } },
                            },
                        },
                    },
                ],
            },
        ],
    },
};
