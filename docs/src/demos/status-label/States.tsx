import { StatusLabel } from 'jarvis-react-ui';
import type { AppOrbState } from 'jarvis-react-ui';

const STATES: AppOrbState[] = ['idle', 'listening', 'thinking', 'speaking', 'follow_up', 'working'];

export default function States() {
    return (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {STATES.map((state) => (
                <div key={state} className="flex flex-col items-center gap-2">
                    <StatusLabel state={state} />
                    <code className="text-[9px] text-text-muted">{state}</code>
                </div>
            ))}
        </div>
    );
}
