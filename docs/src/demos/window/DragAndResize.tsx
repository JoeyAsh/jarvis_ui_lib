import { useRef, useState } from 'react';
import { Window } from 'jarvis-react-ui';
import type { PanelMode, ResizeDir } from 'jarvis-react-ui';

type Rect = { x: number; y: number; w: number; h: number };

const START: Rect = { x: 16, y: 16, w: 300, h: 150 };

function resize(r: Rect, dir: ResizeDir, dx: number, dy: number): Rect {
    const next = { ...r };
    if (dir.includes('e')) next.w = Math.max(200, r.w + dx);
    if (dir.includes('s')) next.h = Math.max(100, r.h + dy);
    if (dir.includes('w')) next.w = Math.max(200, r.w - dx);
    if (dir.includes('n')) next.h = Math.max(100, r.h - dy);
    if (dir.includes('w')) next.x = r.x + r.w - next.w;
    if (dir.includes('n')) next.y = r.y + r.h - next.h;
    return next;
}

export default function DragAndResize() {
    const [rect, setRect] = useState<Rect>(START);
    const [mode, setMode] = useState<PanelMode>('compact');
    const origin = useRef(rect);

    return (
        <div className="relative h-[340px] w-full">
            <Window
                id="notes"
                title="Notes"
                ix="▸"
                position={rect}
                mode={mode}
                onDragStart={() => {
                    origin.current = rect;
                }}
                onDragMove={(_id, dx, dy) =>
                    setRect({
                        ...origin.current,
                        x: origin.current.x + dx,
                        y: origin.current.y + dy,
                    })
                }
                onResizeStart={() => {
                    origin.current = rect;
                }}
                onResizeMove={(_id, dir, dx, dy) => setRect(resize(origin.current, dir, dx, dy))}
                onModeToggle={() => setMode((m) => (m === 'compact' ? 'expanded' : 'compact'))}
                onReset={() => {
                    setRect(START);
                    setMode('compact');
                }}
                itemRenderer={({ mode: m }) =>
                    m === 'compact'
                        ? 'Drag the header. Undock to resize.'
                        : 'Expanded: drag the edges and corners to resize.'
                }
            />
        </div>
    );
}
