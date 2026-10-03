import { useState } from 'react';
import { CornerBrackets, Switch } from 'jarvis-react-ui';

export default function Focused() {
    const [focused, setFocused] = useState(true);

    return (
        <div className="flex flex-col items-center gap-4">
            <CornerBrackets focused={focused} className="p-3">
                <div className="border border-border px-6 py-4 text-[10px] text-accent">
                    {focused ? 'FOCUSED' : 'IDLE'}
                </div>
            </CornerBrackets>
            <Switch label="Focused" size="sm" checked={focused} onCheckedChange={setFocused} />
        </div>
    );
}
