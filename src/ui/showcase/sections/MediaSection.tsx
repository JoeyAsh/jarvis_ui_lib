import { useEffect, useState, type ReactElement } from 'react';
import { MediaControls } from '../../compositions/MediaControls';
import { MediaPlayer } from '../../compositions/MediaPlayer';
import { YouTubePlayer } from '../../compositions/YouTubePlayer';
import { WebFrame } from '../../compositions/WebFrame';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';
import {
    DEMO_AUDIO,
    DEMO_DURATION,
    DEMO_VIDEO,
    DEMO_WEB_URL,
    DEMO_YOUTUBE_ID,
} from './MediaSection.constants';

export function MediaSection(): ReactElement {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(37);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        if (!playing) return;
        const id = window.setInterval(() => setTime((t) => Math.min(DEMO_DURATION, t + 1)), 1000);
        return () => window.clearInterval(id);
    }, [playing]);

    return (
        <section id="media" className="flex flex-col gap-4">
            <SectionHeader title="Compositions · Media">
                MediaControls · MediaPlayer (video, audio) · YouTubePlayer · WebFrame — shortcuts K,
                M, ← →
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <ShowcaseCard
                    label="MEDIA CONTROLS · SIMULATED"
                    code={`<MediaControls\n  title="Mission briefing · 03"\n  playing={playing} currentTime={time} duration={214}\n  volume={volume} muted={muted}\n  onPlayPause={…} onSeek={setTime}\n  onVolumeChange={setVolume} onMutedChange={setMuted}\n  onPrevious={…} onNext={…}\n/>`}
                    dark
                >
                    <div className="flex w-full flex-col gap-4">
                        <MediaControls
                            title="Mission briefing · 03"
                            playing={playing}
                            currentTime={time}
                            duration={DEMO_DURATION}
                            volume={volume}
                            muted={muted}
                            onPlayPause={() => setPlaying(!playing)}
                            onSeek={setTime}
                            onVolumeChange={setVolume}
                            onMutedChange={setMuted}
                            onPrevious={() => setTime(0)}
                            onNext={() => setTime(DEMO_DURATION)}
                        />
                        <MediaControls
                            size="sm"
                            aria-label="Live controls"
                            playing
                            currentTime={0}
                            duration={Number.POSITIVE_INFINITY}
                            onPlayPause={() => undefined}
                        />
                    </div>
                </ShowcaseCard>

                <ShowcaseCard
                    label="MEDIA PLAYER · AUDIO"
                    code={`<MediaPlayer kind="audio" title="T-Rex roar · CC0" src="…/t-rex-roar.mp3" size="sm" />`}
                    dark
                >
                    <MediaPlayer kind="audio" title="T-Rex roar · CC0" src={DEMO_AUDIO} size="sm" />
                </ShowcaseCard>

                <ShowcaseCard
                    label="MEDIA PLAYER · VIDEO"
                    code={`<MediaPlayer title="Flower · CC0" src="…/flower.mp4" />`}
                    dark
                >
                    <MediaPlayer title="Flower · CC0" src={DEMO_VIDEO} />
                </ShowcaseCard>

                <ShowcaseCard
                    label="YOUTUBE PLAYER"
                    code={`<YouTubePlayer videoId="aqz-KE-bpKQ" title="Big Buck Bunny" />`}
                    dark
                >
                    <YouTubePlayer videoId={DEMO_YOUTUBE_ID} title="Big Buck Bunny · Blender" />
                </ShowcaseCard>

                <ShowcaseCard
                    label="WEB FRAME"
                    code={`<WebFrame url="https://example.com" height={260} />`}
                    dark
                >
                    <WebFrame url={DEMO_WEB_URL} height={260} />
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default MediaSection;
