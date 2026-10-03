import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Panel, useDraggable } from 'jarvis-react-ui';

export default function DragBox() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [live, setLive] = useState({ dx: 0, dy: 0 });

    const { onPointerDown, dragging } = useDraggable({
        onMove: (state) => setLive({ dx: state.dx, dy: state.dy }),
        onEnd: (state) => {
            setPos((p) => ({ x: p.x + state.dx, y: p.y + state.dy }));
            setLive({ dx: 0, dy: 0 });
        },
    });

    const offset = {
        '--x': `${pos.x + live.dx}px`,
        '--y': `${pos.y + live.dy}px`,
    } as CSSProperties;

    return (
        <div className="translate-x-[var(--x)] translate-y-[var(--y)]" style={offset}>
            <Panel title={dragging ? 'DRAGGING…' : 'DRAG ME'} className="w-[200px]">
                <div
                    role="presentation"
                    onPointerDown={onPointerDown}
                    className="cursor-grab select-none py-4 text-center text-[10px] text-text-secondary active:cursor-grabbing"
                >
                    Grab here · dx {live.dx} · dy {live.dy}
                </div>
            </Panel>
        </div>
    );
}
