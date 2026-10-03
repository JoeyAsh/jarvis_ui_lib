import { StatusLabel } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

const GERMAN: Partial<Record<AppOrbState, string>> = {
    idle: 'BEREIT',
    listening: 'hört zu...',
    thinking: 'denkt nach...',
    speaking: 'spricht...',
    follow_up: 'Rückfrage...',
    working: 'arbeitet...',
};

export default function Localized() {
    return (
        <div className="flex gap-10">
            <StatusLabel state="idle" labels={GERMAN} />
            <StatusLabel state="thinking" labels={GERMAN} />
            <StatusLabel state="follow_up" labels={GERMAN} />
        </div>
    );
}
