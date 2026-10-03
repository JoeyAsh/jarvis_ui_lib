import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SnapOverlay } from '../SnapOverlay';
import { computeAllSlots, SLOT_IDS } from '../../slotGrid';

const RECTS = computeAllSlots(1200, 800);

describe('SnapOverlay', () => {
    it('renders an empty aria-hidden layer while inactive', () => {
        const { container } = render(
            <SnapOverlay active={false} slotRects={RECTS} hoveredSlot={null} />,
        );
        const root = container.querySelector('.lib-snap');
        expect(root?.getAttribute('aria-hidden')).toBe('true');
        expect(container.querySelectorAll('.lib-snap__zone')).toHaveLength(0);
    });

    it('renders one zone per slot while active', () => {
        const { container } = render(<SnapOverlay active slotRects={RECTS} hoveredSlot={null} />);
        expect(container.querySelectorAll('.lib-snap__zone')).toHaveLength(SLOT_IDS.length);
    });

    it('injects each zone rect as CSS variables instead of raw inline geometry', () => {
        const { container } = render(<SnapOverlay active slotRects={RECTS} hoveredSlot={null} />);
        const zone = container.querySelector<HTMLDivElement>('[data-slot="L1"]');
        expect(zone?.style.getPropertyValue('--lib-snap-zone-x')).toBe(`${RECTS.L1.x}px`);
        expect(zone?.style.getPropertyValue('--lib-snap-zone-y')).toBe(`${RECTS.L1.y}px`);
        expect(zone?.style.getPropertyValue('--lib-snap-zone-w')).toBe(`${RECTS.L1.w}px`);
        expect(zone?.style.getPropertyValue('--lib-snap-zone-h')).toBe(`${RECTS.L1.h}px`);
        expect(zone?.style.left).toBe('');
    });

    it('highlights only the hovered slot', () => {
        const { container } = render(<SnapOverlay active slotRects={RECTS} hoveredSlot="R2" />);
        const hovered = container.querySelectorAll('.lib-snap__zone--hovered');
        expect(hovered).toHaveLength(1);
        expect(hovered[0]?.getAttribute('data-slot')).toBe('R2');
    });

    it('merges className onto the root', () => {
        const { container } = render(
            <SnapOverlay active={false} slotRects={RECTS} hoveredSlot={null} className="extra" />,
        );
        expect(container.querySelector('.lib-snap.extra')).not.toBeNull();
    });
});
