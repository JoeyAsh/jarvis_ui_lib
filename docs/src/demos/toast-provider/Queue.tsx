import { Button, ToastProvider, useToast } from '@ui';

function Burst() {
    const { toast, dismissAll } = useToast();

    function burst() {
        for (let i = 1; i <= 5; i++) {
            toast({ title: `Sensor ${i} online`, duration: 3000 });
        }
    }

    return (
        <>
            <Button onClick={burst}>Fire 5 toasts</Button>
            <Button variant="ghost" onClick={dismissAll}>
                Clear
            </Button>
        </>
    );
}

export default function Queue() {
    return (
        <ToastProvider max={2} placement="top-right">
            <Burst />
        </ToastProvider>
    );
}
