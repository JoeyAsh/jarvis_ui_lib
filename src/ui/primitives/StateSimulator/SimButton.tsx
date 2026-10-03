import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { SimButtonProps } from './SimButton.types';

export function SimButton({ option, active, onChange }: SimButtonProps): ReactElement {
    const hoverSfx = useHoverSfx('button');
    const clickSfx = useClickSfx(() => onChange(option.key));

    return (
        <button
            type="button"
            className={cx(
                'lib-sim__btn',
                active && 'active',
                active && option.key === 'working' && 'working',
            )}
            onClick={clickSfx}
            onMouseEnter={hoverSfx}
            aria-pressed={active}
            data-sfx-hover="button"
        >
            <span className="lib-sim__dot" aria-hidden="true" />
            {option.label}
        </button>
    );
}

export default SimButton;
