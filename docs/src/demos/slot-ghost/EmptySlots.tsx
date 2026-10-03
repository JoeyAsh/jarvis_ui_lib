import { useEffect, useRef, useState } from 'react';
import { SLOT_IDS, SlotGhost, Window, computeSlot } from 'jarvis-react-ui';
import type { SlotId, SlotRect } from 'jarvis-react-ui';

const ASSIGNED: Partial<Record<SlotId, string>> = { L1: 'System', R2: 'Agenda', B2: 'Transcript' };

// The slot grid is made for a full viewport; to fit the demo frame it is computed at 2× and halved.
function demoSlot(id: SlotId, w: number, h: number): SlotRect {
    const r = computeSlot(id, w * 2, h * 2);
    return { x: r.x / 2, y: r.y / 2, w: r.w / 2, h: r.h / 2 };
}

export default function EmptySlots() {
    const stageRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const observer = new ResizeObserver(() =>
            setSize({ w: stage.clientWidth, h: stage.clientHeight }),
        );
        observer.observe(stage);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={stageRef} className="relative h-[340px] w-full overflow-hidden">
            {size.w > 0 &&
                SLOT_IDS.map((id) => {
                    const rect = demoSlot(id, size.w, size.h);
                    const title = ASSIGNED[id];
                    return title === undefined ? (
                        <SlotGhost key={id} rect={rect} label={id} />
                    ) : (
                        <Window
                            key={id}
                            id={id}
                            title={title}
                            position={rect}
                            draggable={false}
                            itemRenderer={() => id}
                        />
                    );
                })}
        </div>
    );
}
