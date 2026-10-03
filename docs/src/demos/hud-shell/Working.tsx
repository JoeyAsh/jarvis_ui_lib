import { useState } from 'react';
import { BrandMark, Button, HUDShell, Panel, TopBar } from 'jarvis-react-ui';

export default function Working() {
    const [working, setWorking] = useState(true);

    return (
        <HUDShell
            working={working}
            topbar={
                <TopBar
                    left={<BrandMark />}
                    right={
                        <Button size="sm" variant="ghost" onClick={() => setWorking((v) => !v)}>
                            {working ? 'Done' : 'Run tool'}
                        </Button>
                    }
                />
            }
        >
            <div className="flex justify-center px-5 pt-20">
                <Panel title="Tool call" className="h-[140px] w-[300px]">
                    <span className="text-text-secondary">
                        {working ? 'Fetching weather data...' : 'Idle.'}
                    </span>
                </Panel>
            </div>
        </HUDShell>
    );
}
