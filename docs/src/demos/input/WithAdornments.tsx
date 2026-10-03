import { Search } from 'lucide-react';
import { Hint, Input } from '@ui';

export default function WithAdornments() {
    return (
        <Input
            aria-label="Search docs"
            placeholder="Search docs…"
            startAdornment={<Search size={12} aria-hidden="true" />}
            endAdornment={<Hint.Key>CTRL K</Hint.Key>}
        />
    );
}
