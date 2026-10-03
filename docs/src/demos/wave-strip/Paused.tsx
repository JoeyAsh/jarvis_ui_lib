import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { IconButton, WaveStrip } from 'jarvis-react-ui';

export default function Paused() {
    const [playing, setPlaying] = useState(false);

    return (
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] text-text-secondary">
            <IconButton
                icon={playing ? Pause : Play}
                label={playing ? 'Pause' : 'Play'}
                size="sm"
                onClick={() => setPlaying((v) => !v)}
            />
            <WaveStrip active={playing} />
            <span>{playing ? 'Playing' : 'Paused'}</span>
        </div>
    );
}
