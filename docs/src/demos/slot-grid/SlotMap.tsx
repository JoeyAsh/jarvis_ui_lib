import type { CSSProperties } from 'react';
import { computeAllSlots, SLOT_IDS } from 'jarvis-react-ui';

// Slot geometry for a 1280 × 800 viewport, drawn at 40 % scale.
const VIEWPORT = { w: 1280, h: 800 };
const SCALE = 0.4;

export default function SlotMap() {
    const slots = computeAllSlots(VIEWPORT.w, VIEWPORT.h);

    return (
        <div
            className="relative w-[var(--w)] h-[var(--h)] border border-border bg-bg"
            style={
                {
                    '--w': `${VIEWPORT.w * SCALE}px`,
                    '--h': `${VIEWPORT.h * SCALE}px`,
                } as CSSProperties
            }
        >
            {SLOT_IDS.map((id) => {
                const r = slots[id];
                return (
                    <div
                        key={id}
                        className="absolute left-[var(--x)] top-[var(--y)] w-[var(--sw)] h-[var(--sh)] flex items-center justify-center border border-accent-dim bg-[rgba(76,168,232,0.06)] text-[9px] tracking-[1px] text-accent"
                        style={
                            {
                                '--x': `${r.x * SCALE}px`,
                                '--y': `${r.y * SCALE}px`,
                                '--sw': `${r.w * SCALE}px`,
                                '--sh': `${r.h * SCALE}px`,
                            } as CSSProperties
                        }
                    >
                        {id}
                    </div>
                );
            })}
        </div>
    );
}
