import { RadioGroup } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <RadioGroup
            aria-label="Render quality"
            defaultValue="high"
            items={[
                { value: 'low', label: 'Low' },
                { value: 'high', label: 'High' },
                { value: 'ultra', label: 'Ultra' },
            ]}
        />
    );
}
