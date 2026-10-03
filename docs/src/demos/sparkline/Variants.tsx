import { Label, Sparkline } from 'jarvis-react-ui';

const CPU = [32, 41, 38, 45, 52, 48, 61, 57, 49, 44, 51, 47];
const TEMP = [61, 63, 66, 70, 74, 79, 83, 86, 85, 88, 91, 90];

export default function Variants() {
    return (
        <div className="flex w-full max-w-[320px] flex-col gap-4">
            <div className="flex flex-col gap-1">
                <Label>CPU load</Label>
                <Sparkline data={CPU} aria-label="CPU load, last 12 samples" />
            </div>
            <div className="flex flex-col gap-1">
                <Label>Core temp</Label>
                <Sparkline data={TEMP} variant="warn" aria-label="Core temperature, rising" />
            </div>
        </div>
    );
}
