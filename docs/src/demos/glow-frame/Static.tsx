import { GlowFrame } from 'jarvis-react-ui';

export default function Static() {
    return (
        <>
            <GlowFrame className="px-6 py-4">
                <span className="text-[10px] text-text-secondary">Default glow</span>
            </GlowFrame>
            <GlowFrame strong className="px-6 py-4">
                <span className="text-[10px] text-accent">LISTENING…</span>
            </GlowFrame>
        </>
    );
}
