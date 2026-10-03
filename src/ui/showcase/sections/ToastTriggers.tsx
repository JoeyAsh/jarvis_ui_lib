import type { ReactElement } from 'react';
import { Button } from '../../primitives/Button';
import { useToast } from '../../compositions/ToastProvider';

/** Buttons that fire toasts through the showcase's JarvisProvider. */
export function ToastTriggers(): ReactElement {
    const { toast, dismissAll } = useToast();

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                size="sm"
                onClick={() => toast({ title: 'Link established', description: 'Uplink stable.' })}
            >
                INFO
            </Button>
            <Button
                size="sm"
                onClick={() => toast({ variant: 'success', title: 'Diagnostics passed' })}
            >
                SUCCESS
            </Button>
            <Button
                size="sm"
                onClick={() =>
                    toast({
                        variant: 'warning',
                        title: 'Power at 18%',
                        action: { label: 'Reroute', onClick: () => undefined },
                    })
                }
            >
                ACTION
            </Button>
            <Button
                size="sm"
                variant="danger"
                onClick={() =>
                    toast({ variant: 'error', title: 'Connection lost', duration: Infinity })
                }
            >
                STICKY ERROR
            </Button>
            <Button size="sm" variant="ghost" onClick={dismissAll}>
                CLEAR
            </Button>
        </div>
    );
}

export default ToastTriggers;
