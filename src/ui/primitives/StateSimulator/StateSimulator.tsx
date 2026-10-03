import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { SimButton } from './SimButton';
import { SIM_OPTIONS } from './constants';
import type { StateSimulatorProps } from './StateSimulator.types';

export function StateSimulator({
    state,
    onChange,
    label = '◈ ORB STATE',
    position = 'fixed-top',
    className,
}: StateSimulatorProps): ReactElement {
    return (
        <div className={cx('lib-sim', position, className)}>
            <span className="lib-sim__label">{label}</span>
            {SIM_OPTIONS.map((opt) => (
                <SimButton
                    key={opt.key}
                    option={opt}
                    active={state === opt.key}
                    onChange={onChange}
                />
            ))}
        </div>
    );
}

export default StateSimulator;
