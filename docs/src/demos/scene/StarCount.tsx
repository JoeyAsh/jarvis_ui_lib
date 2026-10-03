import { Scene } from 'jarvis-react-ui';

export default function StarCount() {
    return (
        <>
            <Scene grid={false} scanlines={false} starCount={200} />
            <span className="relative text-[10px] uppercase tracking-[2px] text-text-secondary">
                200 stars
            </span>
        </>
    );
}
