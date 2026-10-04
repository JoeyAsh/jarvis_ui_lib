import { Button, Label, Metric, Stack } from 'jarvis-react-ui';

export default function Column() {
    return (
        <Stack gap="sm">
            <Label>Reactor output</Label>
            <Metric value={87} unit="%" />
            <Button variant="primary">Run diagnostics</Button>
        </Stack>
    );
}
