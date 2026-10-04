import { useState } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { Select } from 'jarvis-react-ui';

export default function Controlled() {
    const [theme, setTheme] = useState('night');

    return (
        <div className="flex flex-col gap-3">
            <Select
                aria-label="Display mode"
                value={theme}
                onValueChange={setTheme}
                options={[
                    { value: 'night', label: 'Night', icon: <Moon size={12} /> },
                    { value: 'day', label: 'Day', icon: <Sun size={12} /> },
                    { value: 'auto', label: 'Follow location', icon: <Globe size={12} /> },
                ]}
            />
            <span className="text-[10px] text-text-secondary">Value: {theme}</span>
        </div>
    );
}
