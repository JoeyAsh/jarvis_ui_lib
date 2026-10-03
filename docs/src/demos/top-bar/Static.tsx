import { BrandMark, TopBar } from 'jarvis-react-ui';

export default function Static() {
    return (
        <TopBar
            position="static"
            left={<span className="text-[11px] text-text">09:04:17</span>}
            center={
                <span className="text-[9px] tracking-[8px] text-text-muted uppercase">
                    JARVIS / <b className="text-accent-bright font-medium">MK XLII</b>
                </span>
            }
            right={<BrandMark />}
        />
    );
}
