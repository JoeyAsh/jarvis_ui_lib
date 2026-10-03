import { type CSSProperties, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { meterBarDelay } from './utils';
import type { WaveformMeterProps } from './WaveformMeter.types';

export function WaveformMeter({
    active = true,
    barCount = 12,
    mirrored = false,
    className,
}: WaveformMeterProps): ReactElement {
    return (
        <div
            className={cx('lib-meter', !active && 'inactive', mirrored && 'mirrored', className)}
            aria-hidden="true"
        >
            {Array.from({ length: barCount }, (_, i) => (
                <i
                    key={i}
                    className="lib-meter__bar"
                    style={{ '--lib-meter-delay': `${meterBarDelay(i)}s` } as CSSProperties}
                />
            ))}
        </div>
    );
}

export default WaveformMeter;
