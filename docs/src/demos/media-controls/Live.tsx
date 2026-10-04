import { useState } from 'react';
import { MediaControls } from 'jarvis-react-ui';

export default function Live() {
    const [playing, setPlaying] = useState(true);

    return (
        <MediaControls
            size="sm"
            aria-label="Radio controls"
            playing={playing}
            currentTime={0}
            duration={Infinity}
            onPlayPause={() => setPlaying(!playing)}
        />
    );
}
