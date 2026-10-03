import { useState } from 'react';
import { WindowManager } from '@ui';
import type { ManagedWindow, SlotId } from '@ui';

const WINDOWS: ManagedWindow[] = [
    { id: 'system', title: 'System', ix: '◈', itemRenderer: () => 'CPU 42% · RAM 61%' },
    { id: 'transcript', title: 'Transcript', ix: '▸', itemRenderer: () => 'Listening…' },
    { id: 'agenda', title: 'Agenda', ix: '▦', itemRenderer: () => '09:30 · Standup' },
];

export default function Basic() {
    const [assignments, setAssignments] = useState<Record<string, SlotId>>({
        system: 'B1',
        transcript: 'B2',
        agenda: 'B3',
    });

    return (
        <WindowManager
            windows={WINDOWS}
            assignments={assignments}
            onAssignmentsChange={setAssignments}
        />
    );
}
