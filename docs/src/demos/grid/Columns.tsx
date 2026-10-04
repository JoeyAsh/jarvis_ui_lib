import { Grid, Label, Metric, Stack } from 'jarvis-react-ui';

const READINGS = [
    { label: 'CPU', value: 42 },
    { label: 'GPU', value: 67 },
    { label: 'RAM', value: 58 },
];

export default function Columns() {
    return (
        <Grid columns={3} gap="lg" className="w-full">
            {READINGS.map((r) => (
                <Stack key={r.label} gap="xs">
                    <Label>{r.label}</Label>
                    <Metric value={r.value} unit="%" />
                </Stack>
            ))}
        </Grid>
    );
}
