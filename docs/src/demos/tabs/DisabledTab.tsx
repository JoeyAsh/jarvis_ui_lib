import { Tabs } from 'jarvis-react-ui';

export default function DisabledTab() {
    return (
        <Tabs
            aria-label="Sensors"
            panelClassName="text-[11px] text-text-secondary"
            items={[
                { value: 'radar', label: 'Radar', content: '3 contacts in range.' },
                { value: 'lidar', label: 'Lidar', content: 'Calibrating.', disabled: true },
                { value: 'thermal', label: 'Thermal', content: 'No heat signatures.' },
            ]}
        />
    );
}
