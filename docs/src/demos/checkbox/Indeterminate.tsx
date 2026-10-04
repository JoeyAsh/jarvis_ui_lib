import { useState } from 'react';
import { Checkbox } from 'jarvis-react-ui';

const SYSTEMS = ['Radar', 'Comms', 'Shields'];

export default function Indeterminate() {
    const [active, setActive] = useState<string[]>(['Radar']);
    const all = active.length === SYSTEMS.length;

    return (
        <div className="flex flex-col gap-3">
            <Checkbox
                label="All systems"
                checked={all}
                indeterminate={active.length > 0 && !all}
                onCheckedChange={(on) => setActive(on ? SYSTEMS : [])}
            />
            <div className="flex flex-col gap-2 pl-5">
                {SYSTEMS.map((name) => (
                    <Checkbox
                        key={name}
                        label={name}
                        checked={active.includes(name)}
                        onCheckedChange={(on) =>
                            setActive(on ? [...active, name] : active.filter((n) => n !== name))
                        }
                    />
                ))}
            </div>
        </div>
    );
}
