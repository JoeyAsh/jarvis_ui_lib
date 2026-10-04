import { useState } from 'react';
import { Button, Mono, Stack, WindowManager } from 'jarvis-react-ui';
import { useUiWindows } from 'jarvis-react-ui/generative';
import type { UiWindowSpec } from 'jarvis-react-ui/generative';

const VIDEO: UiWindowSpec = {
    id: 'video',
    title: 'Video',
    size: { w: 420, h: 320 },
    root: { type: 'YouTubePlayer', id: 'player', props: { videoId: 'aqz-KE-bpKQ', size: 'sm' } },
};

const VOLUME: UiWindowSpec = {
    id: 'volume',
    title: 'Volume',
    size: { w: 280, h: 160 },
    state: { volume: 40 },
    root: {
        type: 'Stack',
        children: [
            {
                type: 'Slider',
                props: { label: 'Volume', value: { $bind: 'volume' }, showValue: true },
            },
            {
                type: 'Button',
                children: 'Apply',
                on: { onClick: { emit: 'apply_volume', payload: { $state: 'volume' } } },
            },
        ],
    },
};

export default function Windows() {
    const [log, setLog] = useState('—');
    const ui = useUiWindows({
        onAction: (e) => setLog(`${e.windowId} → ${e.name}(${JSON.stringify(e.payload)})`),
    });

    return (
        <>
            <Stack direction="row" gap="sm" wrap className="absolute top-3 left-3 z-[1]">
                <Button size="sm" onClick={() => ui.open(VIDEO)}>
                    Open video
                </Button>
                <Button size="sm" onClick={() => ui.open(VOLUME)}>
                    Open volume
                </Button>
                <Button size="sm" onClick={() => ui.patchState('volume', { volume: 20 })}>
                    Set volume 20
                </Button>
                <Button size="sm" onClick={() => ui.call('video', 'player', 'seek', 90)}>
                    Jump to 1:30
                </Button>
                <Mono size="xs" secondary>
                    {log}
                </Mono>
            </Stack>
            <WindowManager
                windows={ui.windows}
                assignments={{}}
                onAssignmentsChange={() => undefined}
                onClose={ui.onClose}
            />
        </>
    );
}
