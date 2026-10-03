import { StatusBadge } from 'jarvis-react-ui';

export default function States() {
    return (
        <>
            <StatusBadge state="online" label="Link · secure" />
            <StatusBadge state="warn" label="Degraded" />
            <StatusBadge state="offline" label="Offline" />
        </>
    );
}
