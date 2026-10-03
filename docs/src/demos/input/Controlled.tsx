import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { IconButton, Input } from 'jarvis-react-ui';

export default function Controlled() {
    const [query, setQuery] = useState('');

    return (
        <Input
            aria-label="Filter systems"
            placeholder="Filter systems…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            startAdornment={<Search size={12} aria-hidden="true" />}
            endAdornment={
                query === '' ? undefined : (
                    <IconButton icon={X} label="Clear" size="sm" onClick={() => setQuery('')} />
                )
            }
        />
    );
}
