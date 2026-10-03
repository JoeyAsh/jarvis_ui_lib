import { useState } from 'react';
import { PushToTalkButton } from 'jarvis-react-ui';

export default function Toggle() {
    const [live, setLive] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <PushToTalkButton active={live} onClick={() => setLive((v) => !v)} />
            <span className="text-[10px] uppercase tracking-[1px] text-text-muted">
                Mic {live ? 'live' : 'off'}
            </span>
        </div>
    );
}
