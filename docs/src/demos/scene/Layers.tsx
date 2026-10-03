import { Scene } from 'jarvis-react-ui';

export default function Layers() {
    return (
        <>
            <Scene stars={false} scanlines={false} />
            <span className="relative text-[10px] uppercase tracking-[2px] text-text-secondary">
                Grid only
            </span>
        </>
    );
}
