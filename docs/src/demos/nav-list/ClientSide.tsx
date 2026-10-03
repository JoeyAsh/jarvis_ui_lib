import { useState } from 'react';
import { NavList } from 'jarvis-react-ui';
import type { NavListGroup } from 'jarvis-react-ui';

const GROUPS: NavListGroup[] = [
    {
        label: 'Mission',
        items: [
            { id: 'brief', label: 'Briefing', href: '#brief' },
            { id: 'route', label: 'Route', href: '#route' },
            { id: 'debrief', label: 'Debrief', href: '#debrief' },
        ],
    },
];

export default function ClientSide() {
    const [active, setActive] = useState('brief');

    return (
        <div className="flex items-start gap-6">
            <NavList
                className="w-[200px]"
                aria-label="Mission"
                groups={GROUPS}
                activeId={active}
                onItemClick={(item, e) => {
                    e.preventDefault();
                    setActive(item.id);
                }}
            />
            <p className="m-0 font-mono text-[11px] text-text-secondary">
                Active: <span className="text-accent">{active}</span>
            </p>
        </div>
    );
}
