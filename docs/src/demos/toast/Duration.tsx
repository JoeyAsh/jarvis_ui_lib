import { Button, useToast } from '@ui';

export default function Duration() {
    const { toast, dismiss } = useToast();

    return (
        <>
            <Button onClick={() => toast({ title: 'Quick notice', duration: 1500 })}>1.5 s</Button>
            <Button
                onClick={() =>
                    toast({
                        id: 'reactor',
                        variant: 'error',
                        title: 'Reactor offline',
                        description: 'Stays until dismissed.',
                        duration: Infinity,
                    })
                }
            >
                Sticky
            </Button>
            <Button variant="ghost" onClick={() => dismiss('reactor')}>
                Dismiss sticky
            </Button>
        </>
    );
}
