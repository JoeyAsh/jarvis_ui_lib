import { forwardRef, type MouseEvent } from 'react';
import { Mic } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { PushToTalkButtonProps } from './PushToTalkButton.types';

export const PushToTalkButton = forwardRef<HTMLButtonElement, PushToTalkButtonProps>(
    function PushToTalkButton(
        {
            active = false,
            onClick,
            onMouseEnter,
            'aria-label': ariaLabelAttr,
            ariaLabel,
            'aria-pressed': ariaPressed,
            className,
            children,
            ...rest
        },
        ref,
    ) {
        const hoverSfx = useHoverSfx('button');
        const clickSfx = useClickSfx(onClick);

        function handleMouseEnter(e: MouseEvent<HTMLButtonElement>): void {
            hoverSfx(e);
            onMouseEnter?.(e);
        }

        return (
            <button
                type="button"
                {...rest}
                ref={ref}
                className={cx('lib-ptt', active && 'active', className)}
                onClick={clickSfx}
                onMouseEnter={handleMouseEnter}
                aria-label={ariaLabelAttr ?? ariaLabel ?? 'Push to talk'}
                aria-pressed={ariaPressed ?? active}
                data-sfx-hover="button"
            >
                <span className="lib-ptt__rim" aria-hidden="true" />
                {children ?? <Mic size={24} strokeWidth={1.8} aria-hidden="true" />}
            </button>
        );
    },
);

PushToTalkButton.displayName = 'PushToTalkButton';

export default PushToTalkButton;
