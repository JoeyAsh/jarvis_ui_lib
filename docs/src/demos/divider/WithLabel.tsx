import { Divider } from 'jarvis-react-ui';

export default function WithLabel() {
    return (
        <div className="flex w-full flex-col gap-6">
            <Divider label="Telemetry" />
            <Divider label="Diagnostics" variant="accent" />
        </div>
    );
}
