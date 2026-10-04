import { MediaPlayer } from 'jarvis-react-ui';

export default function Audio() {
    return (
        <MediaPlayer
            kind="audio"
            title="T-Rex roar · CC0"
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3"
            size="sm"
        />
    );
}
