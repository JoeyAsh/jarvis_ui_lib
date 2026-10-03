import { WaveStrip } from 'jarvis-react-ui';

export default function NowPlaying() {
    return (
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[1px] text-text-secondary">
            <WaveStrip />
            <span>Now playing · Back in Black</span>
            <WaveStrip mirrored />
        </div>
    );
}
