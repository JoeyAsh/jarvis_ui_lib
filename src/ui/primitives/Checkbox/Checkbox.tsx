import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { Check, Minus } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useHoverSfx, useSfx } from '@core/audio';
import { assignRef } from '@common/utils/assignRef';
import type { CheckboxProps } from './Checkbox.types';

const BOX_CLASSES = {
    sm: 'w-[12px] h-[12px]',
    md: 'w-[14px] h-[14px]',
} as const;

const ICON_SIZE = {
    sm: 9,
    md: 11,
} as const;

/**
 * A native checkbox in HUD chrome: the real `<input type="checkbox">` stays in the DOM (keyboard,
 * forms, screen readers) and is drawn as a hairline box with a glowing check or dash.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    {
        checked,
        defaultChecked = false,
        onCheckedChange,
        indeterminate = false,
        label,
        size = 'md',
        disabled,
        className,
        onChange,
        onMouseEnter,
        ...rest
    },
    ref,
) {
    const [internal, setInternal] = useState(defaultChecked);
    const isOn = checked ?? internal;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const hoverSfx = useHoverSfx('button');
    const { playOneShot } = useSfx();

    useEffect(() => {
        if (inputRef.current !== null) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    function handleChange(e: ChangeEvent<HTMLInputElement>): void {
        onChange?.(e);
        if (e.defaultPrevented || disabled) return;
        playOneShot('click');
        const next = e.target.checked;
        if (checked === undefined) setInternal(next);
        onCheckedChange?.(next);
    }

    function handleMouseEnter(e: MouseEvent<HTMLLabelElement>): void {
        if (!disabled) hoverSfx(e);
    }

    const marked = isOn || indeterminate;

    return (
        <label
            className={cx(
                'inline-flex items-center gap-[8px] font-mono uppercase tracking-[1px] text-text-secondary',
                size === 'sm' ? 'text-[9px]' : 'text-[10px]',
                disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                className,
            )}
            onMouseEnter={handleMouseEnter}
            data-sfx-hover="button"
        >
            <input
                ref={(node) => {
                    inputRef.current = node;
                    assignRef(ref, node);
                }}
                {...rest}
                type="checkbox"
                checked={isOn}
                disabled={disabled}
                onChange={handleChange}
                onMouseEnter={onMouseEnter}
                className="peer sr-only"
            />
            <span
                aria-hidden="true"
                className={cx(
                    'inline-flex items-center justify-center shrink-0 border rounded-[2px]',
                    'transition-all duration-[150ms]',
                    'peer-focus-visible:ring-1 peer-focus-visible:ring-accent',
                    marked
                        ? 'border-accent bg-[rgba(76,168,232,0.15)] text-accent-bright shadow-glow'
                        : 'border-border-bright bg-transparent',
                    BOX_CLASSES[size],
                )}
            >
                {indeterminate ? (
                    <Minus size={ICON_SIZE[size]} strokeWidth={2.5} />
                ) : isOn ? (
                    <Check size={ICON_SIZE[size]} strokeWidth={2.5} />
                ) : null}
            </span>
            {label !== undefined && <span className={cx(marked && 'text-accent')}>{label}</span>}
        </label>
    );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
