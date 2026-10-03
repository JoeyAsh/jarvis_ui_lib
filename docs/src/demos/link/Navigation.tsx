import { useState } from 'react';
import { Link } from '@ui';

const SECTIONS = ['Overview', 'Systems', 'Telemetry'];

export default function Navigation() {
    const [current, setCurrent] = useState('Overview');

    return (
        <nav aria-label="Sections" className="flex items-center gap-5">
            {SECTIONS.map((section) => (
                <Link
                    key={section}
                    href={`#${section.toLowerCase()}`}
                    variant="nav"
                    active={section === current}
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrent(section);
                    }}
                >
                    {section}
                </Link>
            ))}
        </nav>
    );
}
