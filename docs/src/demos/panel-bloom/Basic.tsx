import { useState } from 'react';
import { PanelBloom, Switch } from 'jarvis-react-ui';

export default function Basic() {
    const [active, setActive] = useState(true);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-[90px] w-[260px] items-center justify-center border border-accent">
                <PanelBloom active={active} />
                <span className="relative text-[9px] uppercase tracking-[1px] text-accent">
                    {active ? 'Bloom active' : 'Bloom off'}
                </span>
            </div>
            <Switch label="Active" size="sm" checked={active} onCheckedChange={setActive} />
        </div>
    );
}
