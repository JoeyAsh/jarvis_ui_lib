import { Select } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <Select
            aria-label="Voice"
            placeholder="Choose a voice…"
            options={[
                { value: 'jarvis', label: 'JARVIS' },
                { value: 'friday', label: 'FRIDAY' },
                { value: 'edith', label: 'EDITH' },
                { value: 'karen', label: 'KAREN', disabled: true },
            ]}
        />
    );
}
