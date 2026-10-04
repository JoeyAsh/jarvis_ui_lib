import { Textarea } from 'jarvis-react-ui';

export default function States() {
    return (
        <div className="flex flex-col gap-3">
            <Textarea aria-label="Invalid" invalid defaultValue="Checksum mismatch" rows={2} />
            <Textarea aria-label="Disabled" disabled defaultValue="Read only" rows={2} />
        </div>
    );
}
