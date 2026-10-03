import { useState } from 'react';
import { Button, Window } from 'jarvis-react-ui';

export default function HeaderActions() {
    const [open, setOpen] = useState(true);
    const [resets, setResets] = useState(0);

    if (!open) return <Button onClick={() => setOpen(true)}>Reopen window</Button>;

    return (
        <div className="relative h-[180px] w-[320px]">
            <Window
                id="agenda"
                title="Agenda"
                ix="▦"
                position={{ x: 0, y: 0, w: 320, h: 180 }}
                draggable={false}
                onReset={() => setResets((n) => n + 1)}
                onClose={() => setOpen(false)}
                itemRenderer={() => `09:30 · Standup — reset ${resets}×`}
            />
        </div>
    );
}
