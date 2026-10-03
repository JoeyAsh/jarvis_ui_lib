import { BarChart } from 'jarvis-react-ui';

export default function Grouped() {
    return (
        <BarChart
            className="w-full"
            aria-label="Network traffic per hour"
            labels={['00', '04', '08', '12', '16', '20']}
            series={[
                { id: 'in', label: 'Inbound', data: [12, 30, 22, 41, 18, 9] },
                { id: 'out', label: 'Outbound', data: [8, 14, 19, 25, 12, 6], color: 'bright' },
            ]}
            formatValue={(v) => `${v} GB`}
        />
    );
}
