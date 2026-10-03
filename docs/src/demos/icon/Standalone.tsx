import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { Icon } from 'jarvis-react-ui';

export default function Standalone() {
    return (
        <div className="flex items-center gap-4">
            <Icon icon={ShieldCheck} size="lg" className="text-success" aria-label="Shields up" />
            <Icon icon={ShieldAlert} size="lg" className="text-error" aria-label="Shields down" />
        </div>
    );
}
