import { Slider } from 'jarvis-react-ui';

export default function Range() {
    return (
        <div className="flex flex-col gap-5">
            <Slider
                label="Scan radius"
                min={50}
                max={500}
                step={50}
                defaultValue={200}
                showValue
                formatValue={(v) => `${v} m`}
            />
            <Slider
                label="Gain"
                min={0}
                max={1}
                step={0.05}
                defaultValue={0.6}
                showValue
                formatValue={(v) => `${Math.round(v * 100)} %`}
                size="sm"
            />
        </div>
    );
}
