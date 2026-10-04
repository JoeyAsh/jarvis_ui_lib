import { useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { useHoverSfx, useSfx } from '@core/audio';
import { nextEnabledIndex } from './utils';
import type { RadioGroupProps } from './RadioGroup.types';

const DOT_CLASSES = {
    sm: 'w-[12px] h-[12px]',
    md: 'w-[14px] h-[14px]',
} as const;

const INNER_CLASSES = {
    sm: 'w-[6px] h-[6px]',
    md: 'w-[8px] h-[8px]',
} as const;

/**
 * A set of mutually exclusive options. Arrow keys move the selection (roving focus), so the group
 * is one Tab stop; Space selects the focused option when none is selected yet.
 */
export function RadioGroup({
    items,
    value,
    defaultValue,
    onValueChange,
    orientation = 'vertical',
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    className,
}: RadioGroupProps): ReactElement {
    const [internal, setInternal] = useState(defaultValue);
    const selected = value ?? internal;
    const refs = useRef<(HTMLButtonElement | null)[]>([]);
    const hoverSfx = useHoverSfx('button');
    const { playOneShot } = useSfx();

    const isDisabled = (index: number): boolean => disabled || items[index]?.disabled === true;
    const selectedIndex = items.findIndex((item) => item.value === selected);
    const focusIndex =
        selectedIndex >= 0 && !isDisabled(selectedIndex)
            ? selectedIndex
            : items.findIndex((_item, i) => !isDisabled(i));

    function select(index: number): void {
        const item = items[index];
        if (item === undefined || isDisabled(index) || item.value === selected) return;
        playOneShot('click');
        if (value === undefined) setInternal(item.value);
        onValueChange?.(item.value);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number): void {
        if (disabled) return;
        let target: number | null = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            target = nextEnabledIndex(items, index, 1);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            target = nextEnabledIndex(items, index, -1);
        } else if (e.key === 'Home') {
            target = nextEnabledIndex(items, -1, 1);
        } else if (e.key === 'End') {
            target = nextEnabledIndex(items, items.length, -1);
        } else if (e.key === ' ') {
            e.preventDefault();
            select(index);
            return;
        }
        if (target === null) return;
        e.preventDefault();
        select(target);
        refs.current[target]?.focus();
    }

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-orientation={orientation}
            aria-disabled={disabled || undefined}
            className={cx(
                'flex font-mono',
                orientation === 'vertical' ? 'flex-col gap-[8px]' : 'flex-row flex-wrap gap-[16px]',
                className,
            )}
        >
            {items.map((item, index) => {
                const checked = item.value === selected;
                const off = isDisabled(index);
                return (
                    <button
                        key={item.value}
                        ref={(node) => {
                            refs.current[index] = node;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        disabled={off}
                        tabIndex={index === focusIndex ? 0 : -1}
                        onClick={() => select(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onMouseEnter={off ? undefined : hoverSfx}
                        data-sfx-hover="button"
                        className={cx(
                            'group inline-flex items-start gap-[8px] bg-transparent border-0 p-0 text-left',
                            'rounded-[2px] focus-visible:outline-none',
                            off ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={cx(
                                'inline-flex items-center justify-center shrink-0 border rounded-full mt-[1px]',
                                'transition-all duration-[150ms]',
                                'group-focus-visible:ring-1 group-focus-visible:ring-accent',
                                checked
                                    ? 'border-accent shadow-glow'
                                    : 'border-border-bright group-hover:border-accent-dim',
                                DOT_CLASSES[size],
                            )}
                        >
                            {checked && (
                                <span
                                    className={cx(
                                        'block rounded-full bg-accent-bright',
                                        INNER_CLASSES[size],
                                    )}
                                />
                            )}
                        </span>
                        <span className="flex flex-col gap-[2px]">
                            <span
                                className={cx(
                                    'uppercase tracking-[1px]',
                                    size === 'sm' ? 'text-[9px]' : 'text-[10px]',
                                    checked ? 'text-accent' : 'text-text-secondary',
                                )}
                            >
                                {item.label}
                            </span>
                            {item.description !== undefined && (
                                <span className="text-[10px] text-text-secondary normal-case tracking-normal">
                                    {item.description}
                                </span>
                            )}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default RadioGroup;
