import { Copy, Download, Settings, Trash2 } from 'lucide-react';
import { Divider, IconButton } from '@ui';

export default function Vertical() {
    return (
        <div className="flex items-center gap-1 border border-border rounded-[2px] p-1">
            <IconButton icon={Copy} label="Copy" size="sm" />
            <IconButton icon={Download} label="Download" size="sm" />
            <Divider orientation="vertical" className="mx-1" />
            <IconButton icon={Settings} label="Settings" size="sm" />
            <IconButton icon={Trash2} label="Delete" size="sm" variant="danger" />
        </div>
    );
}
