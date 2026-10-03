import { GridBackground } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <>
            <GridBackground gridSize={22} />
            <span className="relative text-[10px] uppercase tracking-[2px] text-text-muted">
                Grid underlay
            </span>
        </>
    );
}
