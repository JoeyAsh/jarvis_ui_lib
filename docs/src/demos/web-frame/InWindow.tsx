import { useState } from 'react';
import { Button, WebFrame, WindowManager } from 'jarvis-react-ui';
import type { ManagedWindow } from 'jarvis-react-ui';

export default function InWindow() {
    const [windows, setWindows] = useState<ManagedWindow[]>([]);

    const open = () =>
        setWindows([
            {
                id: 'browser',
                title: 'Browser',
                floating: true,
                defaultRect: { x: 24, y: 70, w: 480, h: 320 },
                itemRenderer: () => <WebFrame url="https://example.com" />,
            },
        ]);

    return (
        <>
            <div className="absolute top-3 left-3 z-[1]">
                <Button variant="primary" onClick={open} disabled={windows.length > 0}>
                    Open browser window
                </Button>
            </div>
            <WindowManager
                windows={windows}
                assignments={{}}
                onAssignmentsChange={() => undefined}
                onClose={() => setWindows([])}
            />
        </>
    );
}
