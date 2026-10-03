import { useState } from 'react';
import { PanelRails, Switch } from 'jarvis-react-ui';

export default function Basic() {
    const [visible, setVisible] = useState(true);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative h-[110px] w-[260px] border border-border bg-surface">
                <PanelRails visible={visible} />
                <div className="border-b border-border px-3 py-[6px] text-[9px] uppercase tracking-[2px] text-text-secondary">
                    Telemetry
                </div>
            </div>
            <Switch label="Visible" size="sm" checked={visible} onCheckedChange={setVisible} />
        </div>
    );
}
