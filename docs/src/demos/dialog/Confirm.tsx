import { useState } from 'react';
import { Button, Dialog, useToast } from 'jarvis-react-ui';

export default function Confirm() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    function purge() {
        setOpen(false);
        toast({ variant: 'success', title: 'Cache purged' });
    }

    return (
        <>
            <Button variant="danger" onClick={() => setOpen(true)}>
                Purge cache
            </Button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Purge cache"
                description="All cached telemetry will be deleted."
                size="sm"
                actions={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" size="sm" onClick={purge}>
                            Purge
                        </Button>
                    </>
                }
            >
                This cannot be undone. Running sessions keep their data.
            </Dialog>
        </>
    );
}
