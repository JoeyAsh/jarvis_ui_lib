import { Copy } from 'lucide-react';
import { IconButton, Tooltip } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <Tooltip content="Copy code">
            <IconButton icon={Copy} label="Copy" />
        </Tooltip>
    );
}
