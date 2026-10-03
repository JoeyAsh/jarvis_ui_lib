import { Label, Metric, Pill } from 'jarvis-react-ui';

export default function LabelledBy() {
    return (
        <div role="group" aria-labelledby="reactor-label" className="flex flex-col gap-1">
            <Label id="reactor-label">Arc reactor</Label>
            <div className="flex items-center gap-3">
                <Metric value="98.6" unit="%" />
                <Pill variant="ok">Stable</Pill>
            </div>
        </div>
    );
}
