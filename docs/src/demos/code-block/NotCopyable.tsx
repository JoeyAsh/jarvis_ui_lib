import { CodeBlock } from 'jarvis-react-ui';

export default function NotCopyable() {
    return (
        <CodeBlock
            language="log"
            copyable={false}
            code={
                '[12:04:31] link established\n[12:04:32] handshake ok\n[12:04:33] streaming telemetry'
            }
        />
    );
}
