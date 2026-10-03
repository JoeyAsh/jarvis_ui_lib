import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { Mono, SLOT_IDS, SnapOverlay, computeSlot, slotAtPoint } from 'jarvis-react-ui';
import type { SlotId, SlotRect } from 'jarvis-react-ui';

// The slot grid is made for a full viewport; to fit the demo frame it is computed at 2× and halved.
// In an app, pass the viewport size: computeAllSlots(innerWidth, innerHeight).
function demoSlots(w: number, h: number): Record<SlotId, SlotRect> {
    const rects = {} as Record<SlotId, SlotRect>;
    for (const id of SLOT_IDS) {
        const r = computeSlot(id, w * 2, h * 2);
        rects[id] = { x: r.x / 2, y: r.y / 2, w: r.w / 2, h: r.h / 2 };
    }
    return rects;
}

export default function HoverSlots() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });
    const [hovered, setHovered] = useState<SlotId | null>(null);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const observer = new ResizeObserver(() =>
            setSize({ w: stage.clientWidth, h: stage.clientHeight }),
        );
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    const slotRects = demoSlots(size.w, size.h);

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const box = e.currentTarget.getBoundingClientRect();
        setHovered(slotAtPoint(e.clientX - box.left, e.clientY - box.top, slotRects));
    };

    return (
        <div className="flex w-full flex-col gap-3">
            <Mono size="sm" secondary>
                Move the pointer over the stage · hovered: {hovered ?? 'none'}
            </Mono>
            {/* transform-gpu makes the stage the containing block of the fixed overlay. */}
            <div
                ref={stageRef}
                className="relative h-[300px] w-full overflow-hidden transform-gpu"
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setHovered(null)}
            >
                <SnapOverlay active={size.w > 0} slotRects={slotRects} hoveredSlot={hovered} />
            </div>
        </div>
    );
}
