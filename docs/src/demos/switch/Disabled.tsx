import { Switch } from '@ui';

export default function Disabled() {
    return (
        <>
            <Switch label="Autopilot" disabled />
            <Switch label="Telemetry" defaultChecked disabled />
        </>
    );
}
