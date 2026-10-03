import { BrandMark, Pill, TopBar } from 'jarvis-react-ui';

export default function InTopBar() {
    return (
        <TopBar
            position="static"
            left={<span className="text-[11px] text-text">09:04:17</span>}
            center={<BrandMark sub />}
            right={<Pill variant="ok">Online</Pill>}
        />
    );
}
