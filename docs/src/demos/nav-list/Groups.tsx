import { NavList, Pill } from '@ui';
import type { NavListGroup } from '@ui';

const GROUPS: NavListGroup[] = [
    { items: [{ id: 'overview', label: 'Overview', href: '#overview' }] },
    {
        label: 'Systems',
        items: [
            { id: 'power', label: 'Power', href: '#power' },
            { id: 'comms', label: 'Comms', href: '#comms', badge: <Pill variant="warn">2</Pill> },
            { id: 'sensors', label: 'Sensors', href: '#sensors' },
        ],
    },
    {
        label: 'Labs',
        items: [
            {
                id: 'orb',
                label: 'Orb studio',
                href: '#orb',
                badge: <Pill variant="info">new</Pill>,
            },
        ],
    },
];

export default function Groups() {
    return <NavList className="w-[220px]" aria-label="Systems" groups={GROUPS} activeId="power" />;
}
