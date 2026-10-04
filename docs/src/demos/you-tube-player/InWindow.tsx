import { useState } from 'react';
import { Button, WindowManager, YouTubePlayer } from 'jarvis-react-ui';
import type { ManagedWindow } from 'jarvis-react-ui';

export default function InWindow() {
    const [windows, setWindows] = useState<ManagedWindow[]>([]);

    const open = () =>
        setWindows([
            {
                id: 'video',
                title: 'Now playing',
                floating: true,
                defaultRect: { x: 24, y: 70, w: 420, h: 330 },
                itemRenderer: () => <YouTubePlayer videoId="aqz-KE-bpKQ" size="sm" autoPlay />,
            },
        ]);

    return (
        <>
            <div className="absolute top-3 left-3 z-[1]">
                <Button variant="primary" onClick={open} disabled={windows.length > 0}>
                    Show video
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
