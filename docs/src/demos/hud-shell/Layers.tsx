import { HUDShell, Panel } from 'jarvis-react-ui';

export default function Layers() {
    return (
        <HUDShell
            scene={{ stars: false, scanlines: false }}
            reactor={false}
            viewportCorners={false}
        >
            <div className="p-6">
                <Panel title="Minimal" className="h-[120px] w-[280px]">
                    <span className="text-text-secondary">Grid only, no reactor or corners.</span>
                </Panel>
            </div>
        </HUDShell>
    );
}
