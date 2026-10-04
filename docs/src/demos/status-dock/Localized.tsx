import { useState } from 'react';
import { StatusDock } from 'jarvis-react-ui';

const LABELS = {
    idle: 'BEREIT',
    listening: 'hört zu …',
    thinking: 'denkt nach …',
    speaking: 'spricht …',
    follow_up: 'Rückfrage …',
    working: 'arbeitet …',
};

export default function Localized() {
    const [talking, setTalking] = useState(false);

    return (
        <StatusDock
            state={talking ? 'listening' : 'idle'}
            labels={LABELS}
            pttLabel="Sprechen"
            onPTT={() => setTalking((v) => !v)}
        />
    );
}
