import { useState } from 'react';
import { Panel } from '@ui';

const PANELS = ['Transcript', 'Agenda', 'Now Playing'];

export default function Focus() {
    const [focused, setFocused] = useState('Transcript');

    return (
        <>
            {PANELS.map((title) => (
                <Panel
                    key={title}
                    title={title}
                    focused={focused === title}
                    onFocus={() => setFocused(title)}
                    className="w-[200px] h-[110px]"
                >
                    <span className="text-text-secondary">
                        {focused === title ? 'Focused' : 'Click to focus'}
                    </span>
                </Panel>
            ))}
        </>
    );
}
