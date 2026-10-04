import { WebFrame } from 'jarvis-react-ui';

export default function Blocked() {
    // github.com forbids embedding: the frame stays empty, "Open in new tab" still works.
    return <WebFrame url="https://github.com" height={200} />;
}
