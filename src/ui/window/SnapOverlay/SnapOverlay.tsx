import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { SlotId } from '../slotGrid';
import { SLOT_IDS } from '../slotGrid';
import { rectVars } from '../rectVars';
import type { SnapOverlayProps } from './SnapOverlay.types';

export function SnapOverlay({
    active,
    slotRects,
    hoveredSlot,
    className,
}: SnapOverlayProps): ReactElement {
    const rootCls = cx('lib-snap', className);

    if (!active) {
        return <div className={rootCls} aria-hidden />;
    }

    return (
        <div className={rootCls} aria-hidden>
            {SLOT_IDS.map((slotId: SlotId) => (
                <div
                    key={slotId}
                    className={cx(
                        'lib-snap__zone',
                        hoveredSlot === slotId && 'lib-snap__zone--hovered',
                    )}
                    style={rectVars('lib-snap-zone', slotRects[slotId])}
                    data-slot={slotId}
                />
            ))}
        </div>
    );
}

export default SnapOverlay;
