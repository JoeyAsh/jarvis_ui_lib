import { Power, Radar } from 'lucide-react';
import { Button } from '@ui';

export default function WithIcon() {
    return (
        <>
            <Button variant="primary">
                <span className="inline-flex items-center gap-2">
                    <Power size={12} aria-hidden="true" /> Boot
                </span>
            </Button>
            <Button>
                <span className="inline-flex items-center gap-2">
                    <Radar size={12} aria-hidden="true" /> Scan
                </span>
            </Button>
        </>
    );
}
