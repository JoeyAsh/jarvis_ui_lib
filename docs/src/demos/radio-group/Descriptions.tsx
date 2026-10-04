import { useState } from 'react';
import { RadioGroup } from 'jarvis-react-ui';

export default function Descriptions() {
    const [mode, setMode] = useState('assist');

    return (
        <div className="flex flex-col gap-3">
            <RadioGroup
                aria-label="Autopilot mode"
                value={mode}
                onValueChange={setMode}
                items={[
                    { value: 'manual', label: 'Manual', description: 'You fly, JARVIS watches.' },
                    { value: 'assist', label: 'Assist', description: 'Course corrections only.' },
                    {
                        value: 'full',
                        label: 'Full',
                        description: 'Requires clearance.',
                        disabled: true,
                    },
                ]}
            />
            <span className="text-[10px] text-text-secondary">Mode: {mode}</span>
        </div>
    );
}
