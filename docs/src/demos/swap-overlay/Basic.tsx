import { useState } from 'react';
import { SwapOverlay, Switch, Window } from 'jarvis-react-ui';

const TARGET = { x: 0, y: 0, w: 300, h: 160 };

export default function Basic() {
    const [active, setActive] = useState(true);
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6">
                <Switch label="Active" checked={active} onCheckedChange={setActive} />
                <Switch label="Hovered" checked={hovered} onCheckedChange={setHovered} />
            </div>
            {/* transform-gpu makes this box the containing block of the fixed overlay. */}
            <div className="relative h-[160px] w-[300px] transform-gpu">
                <Window
                    id="agenda"
                    title="Agenda"
                    ix="▦"
                    position={TARGET}
                    draggable={false}
                    itemRenderer={() => '09:30 · Standup'}
                />
                <SwapOverlay active={active} ghostRect={TARGET} hovered={hovered} />
            </div>
        </div>
    );
}
