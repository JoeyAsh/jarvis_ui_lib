import { useRef } from 'react';
import { Button, MediaPlayer } from 'jarvis-react-ui';
import type { MediaHandle } from 'jarvis-react-ui';

export default function Programmatic() {
    const player = useRef<MediaHandle>(null);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => void player.current?.play()}>
                    Play
                </Button>
                <Button size="sm" onClick={() => player.current?.pause()}>
                    Pause
                </Button>
                <Button size="sm" onClick={() => player.current?.seek(2)}>
                    Jump to 0:02
                </Button>
                <Button size="sm" onClick={() => player.current?.setVolume(0.2)}>
                    Volume 20 %
                </Button>
            </div>
            <MediaPlayer
                ref={player}
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
        </div>
    );
}
