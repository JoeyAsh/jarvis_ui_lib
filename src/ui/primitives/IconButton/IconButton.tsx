import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { IconButtonProps } from './IconButton.types';

const VARIANT_CLASSES = {
    ghost: 'bg-transparent text-text-secondary border-transparent hover:text-accent hover:border-border',
    secondary:
        'bg-transparent text-accent border-accent hover:text-accent-bright hover:border-accent-bright hover:shadow-glow',
    primary:
        'bg-accent text-bg border-accent hover:bg-accent-bright hover:border-accent-bright hover:shadow-glow-strong',
    danger: 'bg-transparent text-error border-error hover:bg-error hover:text-bg hover:shadow-glow-error',
} as const;

const SIZE_CLASSES = {
    sm: 'w-[24px] h-[24px]',
    md: 'w-[30px] h-[30px]',
} as const;

const ICON_PX = {
    sm: 12,
    md: 14,
} as const;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
    {
        icon: IconComponent,
        label,
        variant = 'ghost',
        size = 'md',
        pressed,
        className,
        onClick,
        onMouseEnter,
        type = 'button',
        ...rest
    },
    ref,
) {
    const hoverSfx = useHoverSfx('button');

    function handleMouseEnter(e: MouseEvent<HTMLButtonElement>): void {
        hoverSfx(e);
        onMouseEnter?.(e);
    }
    const clickSfx = useClickSfx(onClick);

    return (
        <button
            ref={ref}
            {...rest}
            type={type}
            aria-label={label}
            aria-pressed={pressed}
            className={cx(
                'inline-flex items-center justify-center border rounded-[2px] cursor-pointer shrink-0',
                'transition-all duration-[200ms]',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                pressed === true &&
                    (variant === 'ghost' || variant === 'secondary') &&
                    'text-accent border-accent-dim bg-[rgba(76,168,232,0.08)]',
                pressed === true && variant === 'primary' && 'shadow-glow-strong',
                pressed === true && variant === 'danger' && 'shadow-glow-error',
                className,
            )}
            onMouseEnter={handleMouseEnter}
            onClick={clickSfx}
            data-sfx-hover="button"
        >
            <IconComponent
                width={ICON_PX[size]}
                height={ICON_PX[size]}
                strokeWidth={1.75}
                aria-hidden="true"
            />
        </button>
    );
});

IconButton.displayName = 'IconButton';

export default IconButton;
