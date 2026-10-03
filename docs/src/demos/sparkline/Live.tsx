import { useEffect, useState } from 'react';
import { Label, Metric, Sparkline } from 'jarvis-react-ui';

const SAMPLES = 30;

export default function Live() {
    const [data, setData] = useState<number[]>(() => Array.from({ length: SAMPLES }, () => 50));

    useEffect(() => {
        const id = setInterval(() => {
            setData((prev) => {
                const last = prev[prev.length - 1] ?? 50;
                const next = Math.max(0, Math.min(100, last + (Math.random() - 0.5) * 20));
                return [...prev.slice(1), next];
            });
        }, 500);
        return () => clearInterval(id);
    }, []);

    const current = Math.round(data[data.length - 1] ?? 0);
    const high = current > 80;

    return (
        <div className="flex w-full max-w-[320px] flex-col gap-1">
            <div className="flex items-baseline justify-between">
                <Label>Network throughput</Label>
                <Metric value={current} unit="Mb/s" warn={high} small />
            </div>
            <Sparkline
                data={data}
                variant={high ? 'warn' : 'accent'}
                height={40}
                aria-label="Network throughput, live"
            />
        </div>
    );
}
