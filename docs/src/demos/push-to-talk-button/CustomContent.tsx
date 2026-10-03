import { useState } from 'react';
import { Radio } from 'lucide-react';
import { PushToTalkButton } from 'jarvis-react-ui';

export default function CustomContent() {
    const [open, setOpen] = useState(false);

    return (
        <PushToTalkButton
            active={open}
            onClick={() => setOpen((v) => !v)}
            aria-label="Open radio channel"
        >
            <Radio size={24} strokeWidth={1.8} aria-hidden="true" />
        </PushToTalkButton>
    );
}
