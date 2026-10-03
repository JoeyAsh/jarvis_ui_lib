import { GlassCard } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <GlassCard title="System" bodyClassName="w-[260px] h-[110px]">
            <span className="text-text-secondary">CPU · 42%</span>
        </GlassCard>
    );
}
