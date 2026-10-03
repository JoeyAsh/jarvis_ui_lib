import { Copy, Download, Power, Trash2 } from 'lucide-react';
import { IconButton } from 'jarvis-react-ui';

export default function Variants() {
    return (
        <>
            <IconButton icon={Copy} label="Copy" />
            <IconButton icon={Download} label="Download" variant="secondary" />
            <IconButton icon={Power} label="Power on" variant="primary" />
            <IconButton icon={Trash2} label="Delete" variant="danger" />
        </>
    );
}
