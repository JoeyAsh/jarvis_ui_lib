import { useState } from 'react';
import { BrandMark, Button, HUDShell, Panel, TopBar } from 'jarvis-react-ui';

export default function Idle() {
    const [idle, setIdle] = useState(false);

    return (
        <HUDShell
            idle={idle}
            topbar={
                <TopBar
                    left={<BrandMark />}
                    right={
                        <Button size="sm" variant="ghost" onClick={() => setIdle((v) => !v)}>
                            {idle ? 'Wake' : 'Idle'}
                        </Button>
                    }
                />
            }
        >
            <div className="flex justify-center px-5 pt-20">
                <Panel title="Transcript" className="h-[140px] w-[300px]">
                    <span className="text-text-secondary">
                        {idle ? 'Panels are dimmed and click-through.' : 'Awaiting input.'}
                    </span>
                </Panel>
            </div>
        </HUDShell>
    );
}
