import { GlowFrame } from 'jarvis-react-ui';

export default function Breathe() {
    return (
        <GlowFrame breathe className="px-6 py-4">
            <span className="text-[10px] uppercase tracking-[1px] text-accent">Standby</span>
        </GlowFrame>
    );
}
