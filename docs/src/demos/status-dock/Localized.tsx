import { useState } from 'react';
import { StatusDock } from 'jarvis-react-ui';

export default function Localized() {
    const [talking, setTalking] = useState(false);

    return (
        <StatusDock
            state={talking ? 'listening' : 'idle'}
            pttLabel="Sprechen"
            onPTT={() => setTalking((v) => !v)}
        />
    );
}
