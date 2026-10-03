import type { CSSProperties, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { GridBackgroundProps } from './GridBackground.types';

export function GridBackground({
    drift = false,
    gridSize = 44,
    className,
}: GridBackgroundProps): ReactElement {
    return (
        <div
            aria-hidden
            className={cx(
                'lib-grid-bg fixed inset-0 z-0 pointer-events-none',
                drift && 'lib-grid-bg--drift',
                className,
            )}
            style={
                {
                    '--jlib-grid-size': `${gridSize}px`,
                    '--jlib-grid-duration': `${gridSize * 0.1}s`,
                } as CSSProperties
            }
        />
    );
}

export default GridBackground;
