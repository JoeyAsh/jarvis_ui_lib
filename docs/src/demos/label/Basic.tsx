import { Label, Metric } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <div className="flex gap-8">
            <div className="flex flex-col gap-1">
                <Label>Core temp</Label>
                <Metric value="41.2" unit="°C" />
            </div>
            <div className="flex flex-col gap-1">
                <Label dim>Last sync</Label>
                <Metric value="00:42" unit="ago" small />
            </div>
        </div>
    );
}
