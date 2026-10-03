import { Callout } from 'jarvis-react-ui';

export default function Variants() {
    return (
        <div className="flex w-full max-w-[420px] flex-col gap-2">
            <Callout>Telemetry refreshes every five seconds.</Callout>
            <Callout variant="success">All subsystems online.</Callout>
            <Callout variant="warning">Reactor output above 90 percent.</Callout>
            <Callout variant="error">Uplink lost. Retrying in 10 seconds.</Callout>
        </div>
    );
}
