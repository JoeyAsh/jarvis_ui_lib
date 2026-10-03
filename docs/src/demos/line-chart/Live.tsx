import { useEffect, useState } from 'react';
import { LineChart } from 'jarvis-react-ui';

const WINDOW = 24;

function nextValue(prev: number): number {
    return Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 18));
}

export default function Live() {
    const [data, setData] = useState(() => Array.from({ length: WINDOW }, () => 40));

    useEffect(() => {
        const id = setInterval(() => {
            setData((d) => [...d.slice(1), nextValue(d[d.length - 1] ?? 40)]);
        }, 800);
        return () => clearInterval(id);
    }, []);

    return (
        <LineChart
            className="w-full"
            aria-label="Live uplink throughput"
            series={[{ id: 'uplink', label: 'Uplink', data, color: 'success' }]}
            labels={data.map((_, i) => `${i - WINDOW + 1}s`)}
            yMin={0}
            yMax={100}
            formatValue={(v) => `${Math.round(v)} MB/s`}
            height={160}
        />
    );
}
