import { FileCode, Maximize2, Volume2 } from 'lucide-react';
import { IconButton, Tooltip } from '@ui';

export default function Toolbar() {
    return (
        <div className="flex items-center gap-1">
            <Tooltip content="View source" placement="bottom" delayMs={0}>
                <IconButton icon={FileCode} label="Source" />
            </Tooltip>
            <Tooltip content="Toggle sound" placement="bottom" delayMs={0}>
                <IconButton icon={Volume2} label="Sound" />
            </Tooltip>
            <Tooltip content="Fullscreen" placement="bottom" delayMs={0}>
                <IconButton icon={Maximize2} label="Fullscreen" />
            </Tooltip>
        </div>
    );
}
