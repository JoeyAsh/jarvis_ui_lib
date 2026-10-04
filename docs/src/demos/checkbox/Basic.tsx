import { Checkbox } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="flex flex-col gap-3">
            <Checkbox label="Auto-scan" defaultChecked />
            <Checkbox label="Night mode" />
            <Checkbox label="Telemetry" size="sm" />
            <Checkbox label="Locked" defaultChecked disabled />
        </div>
    );
}
