import { StatusBadge } from 'jarvis-react-ui';

export default function Pulse() {
    return (
        <>
            <StatusBadge label="Pulsing" />
            <StatusBadge label="Steady" pulse={false} />
        </>
    );
}
