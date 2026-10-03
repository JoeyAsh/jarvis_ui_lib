import { Battery, Thermometer, Wifi } from 'lucide-react';
import { Icon, Mono } from 'jarvis-react-ui';

export default function Decorative() {
    return (
        <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2">
                <Icon icon={Wifi} size="sm" className="text-accent" />
                <Mono>Uplink · secure</Mono>
            </span>
            <span className="flex items-center gap-2">
                <Icon icon={Thermometer} size="sm" className="text-warning" />
                <Mono>Core temp · 87 °C</Mono>
            </span>
            <span className="flex items-center gap-2">
                <Icon icon={Battery} size="sm" className="text-success" />
                <Mono>Reserve · 94%</Mono>
            </span>
        </div>
    );
}
