import { useState } from 'react';
import { Button, Metric, WindowManager } from 'jarvis-react-ui';
import type { ManagedWindow } from 'jarvis-react-ui';

export default function Floating() {
    const [windows, setWindows] = useState<ManagedWindow[]>([]);
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [count, setCount] = useState(0);

    const open = () => {
        const id = `scan-${count + 1}`;
        setCount(count + 1);
        setWindows([
            ...windows,
            {
                id,
                title: `Scan ${count + 1}`,
                badge: 'NEW',
                floating: true,
                defaultRect: { x: 40 + (count % 6) * 32, y: 80 + (count % 6) * 24, w: 260, h: 150 },
                itemRenderer: () => <Metric value={(count + 1) * 17} unit="%" />,
            },
        ]);
    };

    return (
        <>
            <div className="absolute top-3 left-3 z-[1]">
                <Button variant="primary" onClick={open}>
                    Open window
                </Button>
            </div>
            <WindowManager
                windows={windows}
                assignments={{}}
                onAssignmentsChange={() => undefined}
                focusedId={focusedId}
                onFocusChange={setFocusedId}
                onClose={(id) => setWindows(windows.filter((w) => w.id !== id))}
            />
        </>
    );
}
