import { useState } from 'react';
import { Radio } from 'lucide-react';
import { PushToTalkButton, StatusDock } from 'jarvis-react-ui';

export default function CustomPtt() {
    const [live, setLive] = useState(false);

    return (
        <StatusDock
            state={live ? 'speaking' : 'idle'}
            ptt={
                <PushToTalkButton
                    active={live}
                    aria-label="Broadcast"
                    onClick={() => setLive((v) => !v)}
                >
                    <Radio size={24} strokeWidth={1.8} aria-hidden="true" />
                </PushToTalkButton>
            }
        />
    );
}
