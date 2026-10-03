import { Pill } from 'jarvis-react-ui';

export default function Variants() {
    return (
        <>
            <Pill>Idle</Pill>
            <Pill variant="ok">Online</Pill>
            <Pill variant="warn">Degraded</Pill>
            <Pill variant="err">Offline</Pill>
            <Pill variant="info">Syncing</Pill>
        </>
    );
}
