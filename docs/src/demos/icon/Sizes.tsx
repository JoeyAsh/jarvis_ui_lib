import { Cpu } from 'lucide-react';
import { Icon } from 'jarvis-react-ui';

export default function Sizes() {
    return (
        <div className="flex items-center gap-6 text-accent">
            <Icon icon={Cpu} size="sm" aria-label="CPU" />
            <Icon icon={Cpu} size="md" aria-label="CPU" />
            <Icon icon={Cpu} size="lg" aria-label="CPU" />
        </div>
    );
}
