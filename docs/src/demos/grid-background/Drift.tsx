import { GridBackground } from 'jarvis-react-ui';

export default function Drift() {
    return (
        <>
            <GridBackground drift gridSize={66} />
            <span className="relative text-[10px] uppercase tracking-[2px] text-text-muted">
                Drifting grid
            </span>
        </>
    );
}
