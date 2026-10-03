import { type CSSProperties, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { LightTraceProps } from './LightTrace.types';

export function LightTrace({ className, color }: LightTraceProps): ReactElement {
    const hasColor = color !== undefined;
    const style = hasColor ? ({ '--lt-color': color } as CSSProperties) : undefined;

    return (
        <span
            className={cx('lib-lighttrace', hasColor && 'lib-lighttrace--custom', className)}
            style={style}
            aria-hidden="true"
        >
            <i className="lib-lighttrace__l" />
            <i className="lib-lighttrace__r" />
        </span>
    );
}

export default LightTrace;
