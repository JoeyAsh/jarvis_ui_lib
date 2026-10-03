import { Settings } from 'lucide-react';
import { IconButton } from 'jarvis-react-ui';

export default function Sizes() {
    return (
        <>
            <IconButton icon={Settings} label="Settings" size="sm" variant="secondary" />
            <IconButton icon={Settings} label="Settings" size="md" variant="secondary" />
        </>
    );
}
