import { WebFrame } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <WebFrame
            url="https://www.openstreetmap.org/export/embed.html?bbox=8.52,47.36,8.56,47.38"
            title="Map"
            height={320}
        />
    );
}
