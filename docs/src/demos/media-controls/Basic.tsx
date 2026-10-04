import { useEffect, useState } from 'react';
import { MediaControls } from 'jarvis-react-ui';

const DURATION = 214;

export default function Basic() {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(37);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);

    // Stands in for a real player: advances the time while "playing".
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setTime((t) => Math.min(DURATION, t + 1)), 1000);
        return () => clearInterval(id);
    }, [playing]);

    return (
        <MediaControls
            title="Mission briefing · 03"
            playing={playing}
            currentTime={time}
            duration={DURATION}
            volume={volume}
            muted={muted}
            onPlayPause={() => setPlaying(!playing)}
            onSeek={setTime}
            onVolumeChange={setVolume}
            onMutedChange={setMuted}
            onPrevious={() => setTime(0)}
            onNext={() => setTime(DURATION)}
        />
    );
}
