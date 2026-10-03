import { BrandMark, TopBar } from '@ui';

export default function Fixed() {
    return (
        <TopBar
            left={<span className="text-[11px] text-text">09:04:17</span>}
            center={<span className="text-[9px] tracking-[8px] text-text-muted">JARVIS</span>}
            right={<BrandMark />}
        />
    );
}
