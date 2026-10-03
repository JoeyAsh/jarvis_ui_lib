import { AreaChart } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <AreaChart
            className="w-full"
            aria-label="Memory usage"
            labels={['00', '04', '08', '12', '16', '20']}
            curve="smooth"
            series={[{ id: 'mem', label: 'Memory', data: [3.1, 2.8, 5.6, 7.9, 7.2, 4.4] }]}
            formatValue={(v) => `${v} GB`}
        />
    );
}
