import { useState } from 'react';
import { Button, Pill, useToast } from 'jarvis-react-ui';

export default function WithAction() {
    const { toast } = useToast();
    const [archived, setArchived] = useState(false);

    function archive() {
        setArchived(true);
        toast({
            title: 'Log archived',
            action: { label: 'Undo', onClick: () => setArchived(false) },
        });
    }

    return (
        <>
            <Button onClick={archive} disabled={archived}>
                Archive log
            </Button>
            <Pill variant={archived ? 'warn' : 'ok'}>{archived ? 'archived' : 'active'}</Pill>
        </>
    );
}
