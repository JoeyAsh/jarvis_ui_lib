import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { WaveformMeter } from '../../primitives/WaveformMeter';
import { PushToTalkButton } from '../../primitives/PushToTalkButton';
import { StatusLabel } from '../../primitives/StatusLabel';
import type { StatusDockProps } from './StatusDock.types';

export function StatusDock({
    state,
    onPTT,
    ptt,
    pttLabel,
    labels,
    brand,
    className,
}: StatusDockProps): ReactElement {
    const isActive = state !== 'idle';

    return (
        <div className={cx('lib-dock', className)}>
            <div className="lib-dock__controls">
                <WaveformMeter active={isActive} />
                {ptt ?? (
                    <PushToTalkButton active={isActive} onClick={onPTT} aria-label={pttLabel} />
                )}
                <WaveformMeter active={isActive} mirrored />
            </div>
            <StatusLabel state={state} labels={labels} brand={brand} live />
        </div>
    );
}

export default StatusDock;
