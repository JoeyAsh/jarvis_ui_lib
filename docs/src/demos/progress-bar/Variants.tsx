import { Label, ProgressBar } from 'jarvis-react-ui';

export default function Variants() {
    return (
        <div className="flex w-full max-w-[320px] flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>CPU · 42%</Label>
                <ProgressBar value={0.42} aria-label="CPU" />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Memory · 70%</Label>
                <ProgressBar value={0.7} variant="bright" aria-label="Memory" />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Power reserve · 15%</Label>
                <ProgressBar value={0.15} variant="warn" aria-label="Power reserve" />
            </div>
        </div>
    );
}
