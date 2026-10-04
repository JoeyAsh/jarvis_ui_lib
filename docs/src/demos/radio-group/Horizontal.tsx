import { RadioGroup } from 'jarvis-react-ui';

export default function Horizontal() {
    return (
        <RadioGroup
            aria-label="Units"
            orientation="horizontal"
            size="sm"
            defaultValue="metric"
            items={[
                { value: 'metric', label: 'Metric' },
                { value: 'imperial', label: 'Imperial' },
            ]}
        />
    );
}
