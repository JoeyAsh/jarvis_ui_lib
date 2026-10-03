import { useState } from 'react';
import { PushToTalkButton } from 'jarvis-react-ui';

export default function HoldToTalk() {
    const [live, setLive] = useState(false);
    const start = () => setLive(true);
    const stop = () => setLive(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <PushToTalkButton
                active={live}
                aria-label="Hold to talk"
                onPointerDown={start}
                onPointerUp={stop}
                onPointerLeave={stop}
                onPointerCancel={stop}
                onKeyDown={(e) => {
                    if (e.key === ' ' && !e.repeat) start();
                }}
                onKeyUp={(e) => {
                    if (e.key === ' ') stop();
                }}
            />
            <span className="text-[10px] uppercase tracking-[1px] text-text-muted">
                {live ? 'Listening · release to send' : 'Hold to talk'}
            </span>
        </div>
    );
}
