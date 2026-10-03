import { useState } from 'react';
import { Switch } from 'jarvis-react-ui';

export default function Controlled() {
    const [sound, setSound] = useState(true);

    return (
        <div className="flex flex-col items-start gap-2">
            <Switch label="Sound" checked={sound} onCheckedChange={setSound} />
            <span className="text-[10px] text-text-muted">Audio {sound ? 'online' : 'muted'}</span>
        </div>
    );
}
