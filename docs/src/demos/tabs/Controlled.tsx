import { useState } from 'react';
import { Button, Tabs } from 'jarvis-react-ui';

export default function Controlled() {
    const [tab, setTab] = useState('status');

    return (
        <div className="flex w-full flex-col gap-3">
            <Tabs
                aria-label="Reactor"
                value={tab}
                onValueChange={setTab}
                panelClassName="text-[11px] text-text-secondary"
                items={[
                    { value: 'status', label: 'Status', content: 'Output stable at 72 percent.' },
                    { value: 'history', label: 'History', content: 'No incidents in 30 days.' },
                    { value: 'config', label: 'Config', content: 'Auto-throttle enabled.' },
                ]}
            />
            <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setTab('status')}>
                    Reset
                </Button>
                <span className="font-mono text-[10px] text-text-muted">value: {tab}</span>
            </div>
        </div>
    );
}
