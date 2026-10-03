import { useState } from 'react';
import { Mono, WindowManager } from 'jarvis-react-ui';
import type { ExpandedRect, ManagedWindow, SlotId } from 'jarvis-react-ui';

const WINDOWS: ManagedWindow[] = [
    { id: 'map', title: 'Map', ix: '◎', itemRenderer: () => 'Undock, then drag or resize me.' },
];

export default function ControlledRects() {
    const [assignments, setAssignments] = useState<Record<string, SlotId>>({ map: 'B2' });
    const [rects, setRects] = useState<Record<string, ExpandedRect>>({});
    const rect = rects.map;

    return (
        <>
            <Mono size="sm" secondary>
                map: {rect ? `${rect.x},${rect.y} ${rect.w}×${rect.h}` : 'docked'}
            </Mono>
            <WindowManager
                windows={WINDOWS}
                assignments={assignments}
                onAssignmentsChange={setAssignments}
                expandedRects={rects}
                onExpandedRectsChange={setRects}
            />
        </>
    );
}
