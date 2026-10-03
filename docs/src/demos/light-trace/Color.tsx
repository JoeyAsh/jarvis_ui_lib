import { LightTrace } from 'jarvis-react-ui';

export default function Color() {
    return (
        <div className="relative w-[280px] border border-border px-6 py-4">
            <LightTrace color="var(--warning)" />
            <span className="text-[10px] text-warning">Thermal warning</span>
        </div>
    );
}
