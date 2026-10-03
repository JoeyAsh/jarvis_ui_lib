import { Hint } from 'jarvis-react-ui';

export default function Inline() {
    return (
        <Hint position="inline">
            Push to talk · <Hint.Key>Space</Hint.Key> · Mute · <Hint.Key>Ctrl+.</Hint.Key>
        </Hint>
    );
}
