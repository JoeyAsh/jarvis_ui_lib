import { useState } from 'react';
import { Metric, Sparkline, WindowManager } from 'jarvis-react-ui';
import type { ManagedWindow, SlotId } from 'jarvis-react-ui';

const WINDOWS: ManagedWindow[] = [
    {
        id: 'cpu',
        title: 'CPU',
        badge: 'LIVE',
        itemRenderer: ({ mode }) =>
            mode === 'compact' ? (
                <Metric value={42} unit="%" small />
            ) : (
                <div className="flex flex-col gap-3">
                    <Metric value={42} unit="%" />
                    <Sparkline data={[30, 42, 38, 51, 47, 42, 45, 39]} />
                </div>
            ),
    },
];

export default function Modes() {
    const [assignments, setAssignments] = useState<Record<string, SlotId>>({ cpu: 'B2' });
    const [focusedId, setFocusedId] = useState<string | null>(null);

    return (
        <WindowManager
            windows={WINDOWS}
            assignments={assignments}
            onAssignmentsChange={setAssignments}
            focusedId={focusedId}
            onFocusChange={setFocusedId}
        />
    );
}
