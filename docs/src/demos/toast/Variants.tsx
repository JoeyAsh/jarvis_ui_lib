import { Button, useToast } from '@ui';

export default function Variants() {
    const { toast } = useToast();

    return (
        <>
            <Button onClick={() => toast({ title: 'Uplink established' })}>Info</Button>
            <Button onClick={() => toast({ variant: 'success', title: 'Diagnostics passed' })}>
                Success
            </Button>
            <Button onClick={() => toast({ variant: 'warning', title: 'Power at 18%' })}>
                Warning
            </Button>
            <Button
                variant="danger"
                onClick={() => toast({ variant: 'error', title: 'Connection lost' })}
            >
                Error
            </Button>
        </>
    );
}
