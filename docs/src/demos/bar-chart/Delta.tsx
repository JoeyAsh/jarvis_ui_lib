import { BarChart } from 'jarvis-react-ui';

export default function Delta() {
    return (
        <BarChart
            className="w-full"
            aria-label="Battery charge change per hour"
            labels={['08', '09', '10', '11', '12', '13', '14']}
            series={[{ id: 'delta', label: 'Change', data: [12, 8, -4, -15, -6, 9, 14] }]}
            formatValue={(v) => `${v > 0 ? '+' : ''}${v}%`}
            height={160}
        />
    );
}
