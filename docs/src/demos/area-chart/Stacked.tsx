import { AreaChart } from 'jarvis-react-ui';

export default function Stacked() {
    return (
        <AreaChart
            className="w-full"
            aria-label="Power output by source"
            labels={['00', '04', '08', '12', '16', '20']}
            stacked
            series={[
                { id: 'arc', label: 'Arc reactor', data: [60, 62, 58, 64, 66, 61] },
                { id: 'solar', label: 'Solar', data: [0, 4, 28, 40, 22, 2], color: 'success' },
                { id: 'grid', label: 'Grid', data: [12, 10, 6, 4, 8, 14], color: 'muted' },
            ]}
            formatValue={(v) => `${v} kW`}
        />
    );
}
