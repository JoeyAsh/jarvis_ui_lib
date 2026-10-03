import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Dialog, Input, Label } from 'jarvis-react-ui';

export default function Form() {
    const [open, setOpen] = useState(false);
    const [callsign, setCallsign] = useState('JARVIS');
    const inputRef = useRef<HTMLInputElement>(null);

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setOpen(false);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Rename: {callsign}</Button>
            <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Rename assistant"
                initialFocusRef={inputRef}
            >
                <form id="rename-form" onSubmit={submit} className="flex flex-col gap-2">
                    <Label htmlFor="callsign">Callsign</Label>
                    <Input
                        id="callsign"
                        ref={inputRef}
                        fullWidth
                        value={callsign}
                        onChange={(e) => setCallsign(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                            Save
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
