import { useState } from 'react';
import { Button, ToastProvider, useToast } from '@ui';
import type { ToastPlacement } from '@ui';

const PLACEMENTS: ToastPlacement[] = ['bottom-right', 'top-right', 'bottom-center', 'top-center'];

function Trigger({ placement }: { placement: ToastPlacement }) {
    const { toast } = useToast();
    return <Button onClick={() => toast({ title: `Shown ${placement}` })}>Show toast</Button>;
}

export default function Placement() {
    const [placement, setPlacement] = useState<ToastPlacement>('top-right');

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
                {PLACEMENTS.map((p) => (
                    <Button
                        key={p}
                        size="sm"
                        variant={p === placement ? 'primary' : 'ghost'}
                        onClick={() => setPlacement(p)}
                    >
                        {p}
                    </Button>
                ))}
            </div>
            <ToastProvider placement={placement}>
                <Trigger placement={placement} />
            </ToastProvider>
        </div>
    );
}
