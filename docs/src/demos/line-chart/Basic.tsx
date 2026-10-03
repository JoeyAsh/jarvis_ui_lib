import { LineChart } from 'jarvis-react-ui';

export default function Basic() {
    return (
        <LineChart
            className="w-full"
            aria-label="CPU load over the day"
            labels={['00', '03', '06', '09', '12', '15', '18', '21']}
            series={[{ id: 'cpu', label: 'CPU', data: [18, 12, 15, 48, 72, 66, 51, 30] }]}
            formatValue={(v) => `${v}%`}
        />
    );
}
