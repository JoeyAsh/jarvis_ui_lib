import { Panel, Reactor, Scene, ViewportCorners } from 'jarvis-react-ui';

export default function Backdrop() {
    return (
        <>
            <Scene />
            <Reactor />
            <ViewportCorners />
            <Panel title="Diagnostics" className="relative h-[120px] w-[280px]">
                <span className="text-text-secondary">All subsystems nominal.</span>
            </Panel>
        </>
    );
}
