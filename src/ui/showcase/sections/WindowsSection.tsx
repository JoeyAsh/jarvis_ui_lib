import { useState, type ReactElement } from 'react';
import { WindowManager } from '../../compositions/WindowManager';
import type { ManagedWindow, PanelMode } from '../../compositions/WindowManager';
import type { SlotId } from '../../window/slotGrid';
import { Table } from '../../compositions/Table';
import type { TableColumn } from '../../compositions/Table';
import { SectionHeader } from '../SectionHeader';
import { makeRenderer } from './WindowsSection.utils';
import type { WindowStateRow } from './WindowsSection.types';

// ── Window definitions ────────────────────────────────────────────────────────

const MANAGED_WINDOWS: ManagedWindow[] = [
    {
        id: 'win-system',
        title: 'SYSTEM',
        ix: '◈',
        itemRenderer: makeRenderer('SYSTEM'),
    },
    {
        id: 'win-transcript',
        title: 'TRANSCRIPT',
        ix: '▸',
        itemRenderer: makeRenderer('TRANSCRIPT'),
    },
    {
        id: 'win-agenda',
        title: 'AGENDA',
        ix: '▦',
        itemRenderer: makeRenderer('AGENDA'),
    },
    {
        id: 'win-nowplaying',
        title: 'NOW PLAYING',
        ix: '♫',
        itemRenderer: makeRenderer('NOW PLAYING'),
    },
];

const INITIAL_ASSIGNMENTS: Record<string, SlotId> = {
    'win-system': 'L1',
    'win-transcript': 'R1',
    'win-agenda': 'R2',
    'win-nowplaying': 'B1',
};

const STATE_COLUMNS: TableColumn<WindowStateRow>[] = [
    { key: 'id', header: 'Window', render: (r) => <span className="text-accent">{r.id}</span> },
    { key: 'slot', header: 'Slot', render: (r) => r.slot },
    { key: 'mode', header: 'Mode', render: (r) => r.mode },
];

// ── Section ───────────────────────────────────────────────────────────────────

export function WindowsSection(): ReactElement {
    const [assignments, setAssignments] = useState<Record<string, SlotId>>(INITIAL_ASSIGNMENTS);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [modes, setModes] = useState<Record<string, PanelMode>>({});

    const rows: WindowStateRow[] = Object.entries(assignments).map(([id, slot]) => ({
        id: id.replace('win-', ''),
        slot,
        mode: modes[id] ?? 'compact',
    }));

    return (
        <section id="windows" className="flex flex-col gap-4">
            <SectionHeader title="Windows">
                WindowManager with dual-mode windows. Compact: drag a header onto another slot to
                move or swap · ↺ restores the home slot. Expanded (⊞ or double-click the header):
                drag to move · resize via edges/corners · ⊟ docks back.
            </SectionHeader>

            <Table
                caption="Live window state"
                columns={STATE_COLUMNS}
                rows={rows}
                getRowKey={(r) => r.id}
                dense
            />

            {/* Scoped stage: transform-gpu contains the fixed WindowManager layers */}
            <div className="relative h-[860px] w-full overflow-hidden border border-border bg-[rgba(5,5,8,0.9)] transform-gpu">
                <WindowManager
                    windows={MANAGED_WINDOWS}
                    assignments={assignments}
                    onAssignmentsChange={setAssignments}
                    focusedId={focusedId}
                    onFocusChange={setFocusedId}
                    modes={modes}
                    onModesChange={setModes}
                />
            </div>
        </section>
    );
}

export default WindowsSection;
