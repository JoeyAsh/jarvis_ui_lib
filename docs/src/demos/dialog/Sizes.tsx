import { useState } from 'react';
import { Button, Dialog } from 'jarvis-react-ui';
import type { DialogSize } from 'jarvis-react-ui';

const SIZES: DialogSize[] = ['sm', 'md', 'lg'];

export default function Sizes() {
    const [size, setSize] = useState<DialogSize | null>(null);

    return (
        <>
            {SIZES.map((s) => (
                <Button key={s} onClick={() => setSize(s)}>
                    {s}
                </Button>
            ))}
            <Dialog
                open={size !== null}
                onOpenChange={() => setSize(null)}
                title={`Size ${size ?? ''}`}
                size={size ?? 'md'}
            >
                The panel is at most {size === 'sm' ? 360 : size === 'lg' ? 720 : 520}px wide and
                never wider than the viewport.
            </Dialog>
        </>
    );
}
