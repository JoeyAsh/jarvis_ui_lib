import { useState } from 'react';
import { Metric, Slider } from 'jarvis-react-ui';

export default function Controlled() {
    const [power, setPower] = useState(72);
    const [committed, setCommitted] = useState(72);

    return (
        <div className="flex flex-col gap-3">
            <Metric value={power} unit="%" />
            <Slider
                aria-label="Reactor output"
                value={power}
                onValueChange={setPower}
                onValueCommit={setCommitted}
            />
            <span className="text-[10px] text-text-secondary">Last committed: {committed} %</span>
            <Slider aria-label="Locked" defaultValue={30} disabled />
        </div>
    );
}
