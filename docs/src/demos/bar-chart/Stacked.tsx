import { BarChart } from 'jarvis-react-ui';

export default function Stacked() {
    return (
        <BarChart
            className="w-full"
            aria-label="Requests by status"
            labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            stacked
            series={[
                { id: 'ok', label: '2xx', data: [920, 1040, 980, 1210, 1130], color: 'success' },
                { id: 'warn', label: '4xx', data: [40, 52, 38, 61, 44], color: 'warning' },
                { id: 'err', label: '5xx', data: [6, 3, 18, 4, 2], color: 'error' },
            ]}
        />
    );
}
