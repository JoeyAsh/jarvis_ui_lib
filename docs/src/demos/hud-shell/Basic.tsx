import { HUDShell, Panel } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <HUDShell>
            <div className="p-6">
                <Panel title="Diagnostics" className="h-[120px] w-[280px]">
                    <span className="text-text-secondary">All subsystems nominal.</span>
                </Panel>
            </div>
        </HUDShell>
    );
}
