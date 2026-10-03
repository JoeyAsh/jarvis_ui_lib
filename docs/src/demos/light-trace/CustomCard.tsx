import { useState } from 'react';
import { CornerBrackets, LightTrace, PanelBloom, PanelRails, Switch } from 'jarvis-react-ui';

export default function CustomCard() {
    const [active, setActive] = useState(true);

    return (
        <div className="flex flex-col items-center gap-4">
            <CornerBrackets focused={active}>
                <div className="relative h-[120px] w-[260px] border border-border bg-surface">
                    <PanelBloom active={active} />
                    <PanelRails visible={active} />
                    <LightTrace />
                    <div className="relative border-b border-border px-3 py-[6px] text-[9px] uppercase tracking-[2px] text-text-secondary">
                        Reactor core
                    </div>
                    <div className="relative px-3 py-2 text-[11px] text-text">Output 3.2 GW</div>
                </div>
            </CornerBrackets>
            <Switch label="Active" size="sm" checked={active} onCheckedChange={setActive} />
        </div>
    );
}
