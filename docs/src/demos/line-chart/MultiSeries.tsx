import { LineChart } from 'jarvis-react-ui';

export default function MultiSeries() {
    return (
        <LineChart
            className="w-full"
            aria-label="Core temperatures"
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
            curve="smooth"
            showDots
            series={[
                { id: 'core', label: 'Core', data: [61, 64, 70, 68, 75, 72, 66] },
                {
                    id: 'shell',
                    label: 'Shell',
                    data: [40, 42, 47, 46, 51, 49, 44],
                    color: 'success',
                },
                { id: 'limit', label: 'Limit', data: [80, 80, 80, 80, 80, 80, 80], color: 'error' },
            ]}
            formatValue={(v) => `${v}°`}
        />
    );
}
