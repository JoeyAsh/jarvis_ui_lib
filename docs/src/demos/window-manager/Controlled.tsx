import { useState } from 'react';
import { Mono, WindowManager } from '@ui';
import type { ManagedWindow, PanelMode, SlotId } from '@ui';

const WINDOWS: ManagedWindow[] = [
    { id: 'system', title: 'System', ix: '◈', itemRenderer: ({ mode }) => mode },
    { id: 'agenda', title: 'Agenda', ix: '▦', itemRenderer: ({ mode }) => mode },
];

export default function Controlled() {
    const [assignments, setAssignments] = useState<Record<string, SlotId>>({
        system: 'B1',
        agenda: 'B3',
    });
    const [focusedId, setFocusedId] = useState<string | null>('system');
    const [modes, setModes] = useState<Record<string, PanelMode>>({});

    return (
        <>
            <Mono size="sm" secondary>
                focus: {focusedId ?? 'none'} · slots:{' '}
                {Object.entries(assignments)
                    .map(([id, slot]) => `${id}→${slot}`)
                    .join(' ')}{' '}
                · modes: {WINDOWS.map((w) => `${w.id}→${modes[w.id] ?? 'compact'}`).join(' ')}
            </Mono>
            <WindowManager
                windows={WINDOWS}
                assignments={assignments}
                onAssignmentsChange={setAssignments}
                focusedId={focusedId}
                onFocusChange={setFocusedId}
                modes={modes}
                onModesChange={setModes}
            />
        </>
    );
}
