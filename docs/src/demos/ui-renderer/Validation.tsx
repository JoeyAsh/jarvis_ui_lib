import { CodeBlock } from 'jarvis-react-ui';
import { validateUiSpec } from 'jarvis-react-ui/generative';

// A spec with mistakes, as a model might produce it.
const SPEC = {
    id: 'broken',
    state: { level: 3 },
    root: {
        type: 'Stack',
        children: [
            { type: 'ThreeOrb' },
            { type: 'Slider', props: { value: { $bind: 'volume' }, color: 'red' } },
            { type: 'Link', props: { href: 'javascript:alert(1)' }, children: 'Click' },
        ],
    },
};

export default function Validation() {
    const { errors } = validateUiSpec(SPEC);
    const text = errors.map((e) => `${e.path}: ${e.message}`).join('\n');
    return <CodeBlock code={text} language="text" title="validateUiSpec(spec).errors" />;
}
