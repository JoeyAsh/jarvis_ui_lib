import { Button, Pill, Stack } from 'jarvis-react-ui';

export default function Row() {
    return (
        <Stack direction="row" align="center" justify="between" gap="md" wrap className="w-full">
            <Stack direction="row" align="center" gap="xs">
                <Pill variant="ok">online</Pill>
                <Pill>3 tasks</Pill>
            </Stack>
            <Stack direction="row" gap="sm">
                <Button size="sm">Cancel</Button>
                <Button size="sm" variant="primary">
                    Engage
                </Button>
            </Stack>
        </Stack>
    );
}
