import type { ReactElement } from 'react';
import { LineChart } from '../../compositions/LineChart';
import { AreaChart } from '../../compositions/AreaChart';
import { BarChart } from '../../compositions/BarChart';
import type { ChartSeries } from '../../compositions/ChartFrame';
import { ShowcaseCard } from '../ShowcaseCard';
import { SectionHeader } from '../SectionHeader';

const HOURS = ['00', '04', '08', '12', '16', '20'];

const LOAD: ChartSeries[] = [
    { id: 'cpu', label: 'CPU', data: [22, 18, 54, 71, 63, 40] },
    { id: 'gpu', label: 'GPU', data: [10, 8, 32, 88, 70, 25], color: 'warning' },
];

const POWER: ChartSeries[] = [
    { id: 'arc', label: 'Arc reactor', data: [60, 62, 58, 64, 66, 61] },
    { id: 'solar', label: 'Solar', data: [0, 4, 28, 40, 22, 2], color: 'success' },
];

const TRAFFIC: ChartSeries[] = [
    { id: 'in', label: 'Inbound', data: [12, 30, 22, 41, 18, 9] },
    { id: 'out', label: 'Outbound', data: [8, 14, 19, 25, 12, 6], color: 'bright' },
];

export function ChartsSection(): ReactElement {
    return (
        <section id="charts" className="flex flex-col gap-4">
            <SectionHeader title="Compositions · Charts">
                LineChart · AreaChart · BarChart — hover or focus + arrow keys to inspect
            </SectionHeader>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <ShowcaseCard
                    label="LINE CHART (smooth)"
                    code={`<LineChart aria-label="Load" series={series} labels={hours} curve="smooth" />`}
                    dark
                >
                    <LineChart
                        className="w-full"
                        aria-label="System load"
                        series={LOAD}
                        labels={HOURS}
                        curve="smooth"
                        height={140}
                        formatValue={(v) => `${v}%`}
                    />
                </ShowcaseCard>
                <ShowcaseCard
                    label="AREA CHART (stacked)"
                    code={`<AreaChart aria-label="Power" series={series} labels={hours} stacked />`}
                    dark
                >
                    <AreaChart
                        className="w-full"
                        aria-label="Power output"
                        series={POWER}
                        labels={HOURS}
                        stacked
                        height={140}
                    />
                </ShowcaseCard>
                <ShowcaseCard
                    label="BAR CHART (grouped)"
                    code={`<BarChart aria-label="Traffic" series={series} labels={hours} />`}
                    dark
                >
                    <BarChart
                        className="w-full"
                        aria-label="Network traffic"
                        series={TRAFFIC}
                        labels={HOURS}
                        height={140}
                    />
                </ShowcaseCard>
            </div>
        </section>
    );
}

export default ChartsSection;
