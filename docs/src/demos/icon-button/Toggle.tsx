import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { IconButton } from 'jarvis-react-ui';

export default function Toggle() {
    const [muted, setMuted] = useState(false);

    return (
        <IconButton
            icon={muted ? VolumeX : Volume2}
            label="Mute"
            pressed={muted}
            onClick={() => setMuted((m) => !m)}
        />
    );
}
