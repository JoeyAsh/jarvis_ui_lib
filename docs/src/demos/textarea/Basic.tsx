import { Textarea } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="flex flex-col gap-3">
            <Textarea aria-label="Mission notes" placeholder="Mission notes…" />
            <Textarea aria-label="Compact notes" placeholder="Compact" size="sm" rows={2} />
        </div>
    );
}
