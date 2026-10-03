import { forwardRef } from 'react';
import { cx } from '@common/utils/cx';
import { useHoverSfx } from '@core/audio';
import type { InputProps } from './Input.types';

const SIZE_CLASSES = {
    sm: 'h-[26px] px-[8px] gap-[6px] text-[10px]',
    md: 'h-[32px] px-[10px] gap-[8px] text-[11px]',
} as const;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        size = 'md',
        startAdornment,
        endAdornment,
        invalid = false,
        fullWidth = false,
        disabled,
        className,
        inputClassName,
        ...rest
    },
    ref,
) {
    const hoverSfx = useHoverSfx('button');

    return (
        <div
            className={cx(
                'inline-flex items-center font-mono border rounded-[2px] bg-[rgba(13,13,20,0.75)]',
                'transition-all duration-[200ms]',
                invalid
                    ? 'border-error focus-within:shadow-glow-error'
                    : 'border-border hover:border-border-bright focus-within:border-accent focus-within:shadow-glow',
                disabled && 'opacity-40 cursor-not-allowed',
                fullWidth ? 'flex w-full' : 'w-[220px]',
                SIZE_CLASSES[size],
                className,
            )}
            onMouseEnter={disabled ? undefined : hoverSfx}
            data-sfx-hover="button"
        >
            {startAdornment !== undefined && (
                <span className="inline-flex items-center text-text-secondary shrink-0">
                    {startAdornment}
                </span>
            )}
            <input
                ref={ref}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={cx(
                    'min-w-0 flex-1 bg-transparent text-text outline-none',
                    'placeholder:text-text-muted disabled:cursor-not-allowed',
                    inputClassName,
                )}
                {...rest}
            />
            {endAdornment !== undefined && (
                <span className="inline-flex items-center text-text-secondary shrink-0">
                    {endAdornment}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
