import { Search } from 'lucide-react';
import { Hint, Input } from 'jarvis-react-ui';

export default function KeyChip() {
    return (
        <Input
            aria-label="Search systems"
            placeholder="Search systems…"
            startAdornment={<Search size={12} aria-hidden="true" />}
            endAdornment={<Hint.Key>/</Hint.Key>}
        />
    );
}
