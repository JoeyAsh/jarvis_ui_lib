import { useEffect, useState } from 'react';
import { Label, Metric, ProgressBar } from 'jarvis-react-ui';

export default function Live() {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setValue((v) => (v >= 1 ? 0 : Math.min(1, v + 0.04)));
        }, 200);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex w-full max-w-[320px] flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <Label>Firmware upload</Label>
                <Metric value={Math.round(value * 100)} unit="%" small />
            </div>
            <ProgressBar value={value} height="normal" aria-label="Firmware upload" />
        </div>
    );
}
