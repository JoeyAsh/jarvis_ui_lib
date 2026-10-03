import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useResizable } from 'jarvis-react-ui';

const MIN = 120;

export default function ResizeBox() {
    const [size, setSize] = useState({ w: 220, h: 140 });
    const [delta, setDelta] = useState({ dx: 0, dy: 0 });

    const { onPointerDown, resizing } = useResizable({
        onMove: (state) => setDelta({ dx: state.dx, dy: state.dy }),
        onEnd: (state) => {
            setSize((s) => ({
                w: Math.max(MIN, s.w + state.dx),
                h: Math.max(MIN / 2, s.h + state.dy),
            }));
            setDelta({ dx: 0, dy: 0 });
        },
    });

    const w = Math.max(MIN, size.w + delta.dx);
    const h = Math.max(MIN / 2, size.h + delta.dy);

    return (
        <div
            className="relative flex w-[var(--w)] h-[var(--h)] items-center justify-center border border-border-bright bg-surface text-[10px] text-text-secondary"
            style={{ '--w': `${w}px`, '--h': `${h}px` } as CSSProperties}
        >
            {Math.round(w)} × {Math.round(h)} {resizing && '· resizing'}
            <span
                role="presentation"
                onPointerDown={onPointerDown('se')}
                className="absolute -right-[5px] -bottom-[5px] h-[10px] w-[10px] cursor-se-resize border border-accent bg-bg"
            />
        </div>
    );
}
