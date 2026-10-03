import { useState } from 'react';
import { Button, GlassCard } from 'jarvis-react-ui';

export default function Focused() {
    const [focused, setFocused] = useState(true);

    return (
        <div className="flex flex-col items-center gap-6">
            <GlassCard title="Uplink" focused={focused} bodyClassName="w-[260px] h-[110px]">
                <span className={focused ? 'text-accent' : 'text-text-secondary'}>
                    {focused ? 'Focused' : 'Standby'}
                </span>
            </GlassCard>
            <Button size="sm" onClick={() => setFocused((f) => !f)}>
                {focused ? 'Blur' : 'Focus'}
            </Button>
        </div>
    );
}
