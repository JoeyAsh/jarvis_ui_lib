import type { CSSProperties, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { SwatchButtonProps } from './Tweaks.types';

export function SwatchButton({ hue, active, onSelect }: SwatchButtonProps): ReactElement {
    const hoverSfx = useHoverSfx('button');
    const clickSfx = useClickSfx(onSelect);
    return (
        <button
            type="button"
            className={cx('lib-tweaks__swatch', active && 'active')}
            style={{ '--lib-tweaks-swatch-hue': hue } as CSSProperties}
            onClick={clickSfx}
            onMouseEnter={hoverSfx}
            aria-label={`Hue ${hue}`}
            aria-pressed={active}
            data-sfx-hover="button"
        />
    );
}

export default SwatchButton;
