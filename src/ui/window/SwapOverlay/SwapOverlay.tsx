import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { rectVars } from '../rectVars';
import type { SwapOverlayProps } from './SwapOverlay.types';

export function SwapOverlay({
    active,
    ghostRect,
    hovered = false,
    className,
}: SwapOverlayProps): ReactElement {
    const rootCls = cx('lib-swap', className);

    if (!active || ghostRect === null) {
        return <div className={rootCls} aria-hidden />;
    }

    return (
        <div className={rootCls} aria-hidden>
            <div
                className={cx('lib-swap__ghost', hovered && 'lib-swap__ghost--hovered')}
                style={rectVars('lib-swap-ghost', ghostRect)}
            />
        </div>
    );
}

export default SwapOverlay;
