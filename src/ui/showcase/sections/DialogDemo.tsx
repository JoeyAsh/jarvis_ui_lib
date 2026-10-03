import { useState, type ReactElement } from 'react';
import { Button } from '../../primitives/Button';
import { Dialog } from '../../compositions/Dialog';

/** Opens a confirmation dialog (showcase demo). */
export function DialogDemo(): ReactElement {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>PURGE CACHE</Button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Purge cache"
                description="All cached telemetry will be deleted."
                size="sm"
                actions={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            CANCEL
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => setOpen(false)}>
                            PURGE
                        </Button>
                    </>
                }
            >
                This cannot be undone. Running sessions keep their data.
            </Dialog>
        </>
    );
}

export default DialogDemo;
