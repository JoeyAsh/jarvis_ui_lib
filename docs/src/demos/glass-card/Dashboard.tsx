import { GlassCard, Metric, StatusBadge } from 'jarvis-react-ui';

export default function Dashboard() {
    return (
        <>
            <GlassCard title="Vitals" bodyClassName="w-[220px] h-[120px]">
                <div className="grid grid-cols-2 gap-3">
                    <Metric value={42} unit="%" />
                    <Metric value={68} unit="°C" warn />
                </div>
            </GlassCard>
            <GlassCard title="Network" bodyClassName="w-[220px] h-[120px]">
                <div className="flex flex-col gap-2">
                    <StatusBadge label="Uplink · secure" />
                    <StatusBadge state="warn" label="Relay · degraded" />
                    <StatusBadge state="offline" label="Backup · offline" />
                </div>
            </GlassCard>
        </>
    );
}
