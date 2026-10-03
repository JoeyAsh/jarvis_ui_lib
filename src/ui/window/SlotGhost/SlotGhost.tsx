import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { rectVars } from '../rectVars';
import type { SlotGhostProps } from './SlotGhost.types';

export function SlotGhost({ rect, label, className }: SlotGhostProps): ReactElement {
    return (
        <div
            className={cx('lib-slot-ghost', className)}
            style={rectVars('lib-slot-ghost', rect)}
            aria-hidden
        >
            {label !== undefined && <span className="lib-slot-ghost__label">{label}</span>}
        </div>
    );
}

export default SlotGhost;
