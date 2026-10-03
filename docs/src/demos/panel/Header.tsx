import { RefreshCw, Settings } from 'lucide-react';
import { IconButton, Metric, Panel } from 'jarvis-react-ui';

export default function Header() {
    return (
        <Panel
            ix="◈"
            title="System Vitals"
            badge="LIVE"
            actions={
                <>
                    <IconButton icon={RefreshCw} label="Refresh" size="sm" />
                    <IconButton icon={Settings} label="Settings" size="sm" />
                </>
            }
            className="w-[316px] h-[150px]"
        >
            <div className="grid grid-cols-2 gap-3">
                <Metric value={42} unit="%" />
                <Metric value={68} unit="°C" warn />
            </div>
        </Panel>
    );
}
