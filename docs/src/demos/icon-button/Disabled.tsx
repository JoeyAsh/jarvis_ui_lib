import { RefreshCw } from 'lucide-react';
import { IconButton } from 'jarvis-react-ui';

export default function Disabled() {
    return (
        <>
            <IconButton icon={RefreshCw} label="Refresh" disabled />
            <IconButton icon={RefreshCw} label="Refresh" variant="secondary" disabled />
        </>
    );
}
