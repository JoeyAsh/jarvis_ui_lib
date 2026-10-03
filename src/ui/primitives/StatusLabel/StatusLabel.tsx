import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { STATUS_LABEL_TEXTS } from './constants';
import type { StatusLabelProps } from './StatusLabel.types';

export function StatusLabel({
    state,
    labels,
    live = false,
    brand = 'J A R V I S',
    className,
}: StatusLabelProps): ReactElement {
    const isActive = state !== 'idle';
    const text = labels?.[state] ?? STATUS_LABEL_TEXTS[state];

    return (
        <div className={cx('lib-status-label', className)}>
            <span
                className={cx('lib-status-label__state', isActive && 'active')}
                role={live ? 'status' : undefined}
                aria-live={live ? 'polite' : undefined}
            >
                {text}
            </span>
            <span className="lib-status-label__brand">{brand}</span>
        </div>
    );
}

export default StatusLabel;
