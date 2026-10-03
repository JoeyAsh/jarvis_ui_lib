import { forwardRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { SwitchProps } from './Switch.types';

const TRACK_CLASSES = {
    sm: 'w-[24px] h-[12px]',
    md: 'w-[32px] h-[16px]',
} as const;

const THUMB_CLASSES = {
    sm: 'w-[8px] h-[8px]',
    md: 'w-[10px] h-[10px]',
} as const;

const THUMB_ON_CLASSES = {
    sm: 'translate-x-[12px]',
    md: 'translate-x-[16px]',
} as const;

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
    {
        checked,
        defaultChecked = false,
        onCheckedChange,
        label,
        size = 'md',
        className,
        onClick,
        onMouseEnter,
        type = 'button',
        ...rest
    },
    ref,
) {
    const [internal, setInternal] = useState(defaultChecked);
    const isOn = checked ?? internal;
    const hoverSfx = useHoverSfx('button');

    function handleMouseEnter(e: MouseEvent<HTMLButtonElement>): void {
        hoverSfx(e);
        onMouseEnter?.(e);
    }

    function handleClick(e: MouseEvent<HTMLButtonElement>): void {
        onClick?.(e);
        if (e.defaultPrevented) return;
        const next = !isOn;
        if (checked === undefined) setInternal(next);
        onCheckedChange?.(next);
    }

    const clickSfx = useClickSfx(handleClick);

    return (
        <button
            ref={ref}
            {...rest}
            type={type}
            role="switch"
            aria-checked={isOn}
            className={cx(
                'inline-flex items-center gap-[8px] bg-transparent border-0 p-0 cursor-pointer font-mono',
                'text-[10px] uppercase tracking-[1px] text-text-secondary rounded-[2px]',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                className,
            )}
            onMouseEnter={handleMouseEnter}
            onClick={clickSfx}
            data-sfx-hover="button"
        >
            <span
                aria-hidden="true"
                className={cx(
                    'relative inline-flex items-center shrink-0 border rounded-[2px] px-[2px]',
                    'transition-all duration-[200ms]',
                    isOn
                        ? 'border-accent bg-[rgba(76,168,232,0.15)] shadow-glow'
                        : 'border-border-bright bg-transparent',
                    TRACK_CLASSES[size],
                )}
            >
                <span
                    className={cx(
                        'block rounded-[1px] transition-all duration-[200ms]',
                        isOn ? 'bg-accent-bright' : 'bg-text-secondary',
                        THUMB_CLASSES[size],
                        isOn && THUMB_ON_CLASSES[size],
                    )}
                />
            </span>
            {label !== undefined && <span className={cx(isOn && 'text-accent')}>{label}</span>}
        </button>
    );
});

Switch.displayName = 'Switch';

export default Switch;
