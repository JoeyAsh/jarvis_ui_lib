import { forwardRef, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { cx } from '@common/utils/cx';
import { useHoverSfx, useSfx } from '@core/audio';
import { snapValue, toPercent, valueFromKey, valueFromPointer } from './utils';
import type { SliderProps } from './Slider.types';

// The horizontal margin is half the thumb width, so the thumb stays inside the root at 0 and 100 %.
const TRACK_CLASSES = {
    sm: 'h-[12px] mx-[4px]',
    md: 'h-[16px] mx-[5px]',
} as const;

const THUMB_CLASSES = {
    sm: 'w-[8px] h-[8px]',
    md: 'w-[10px] h-[10px]',
} as const;

/**
 * Horizontal range input: drag the thumb or the track, or use the arrow keys, PageUp/PageDown,
 * Home and End. Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
    {
        value,
        defaultValue,
        onValueChange,
        onValueCommit,
        min = 0,
        max = 100,
        step = 1,
        label,
        showValue = false,
        formatValue,
        size = 'md',
        fullWidth = false,
        disabled = false,
        'aria-label': ariaLabel,
        className,
        onMouseEnter,
        ...rest
    },
    ref,
) {
    const [internal, setInternal] = useState(() => snapValue(defaultValue ?? min, min, max, step));
    const current = snapValue(value ?? internal, min, max, step);
    const [dragging, setDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const latestRef = useRef(current);
    useLayoutEffect(() => {
        latestRef.current = current;
    });

    const labelId = useId();
    const hoverSfx = useHoverSfx('button');
    const { playOneShot } = useSfx();
    const text = formatValue ? formatValue(current) : String(current);

    function update(next: number): void {
        if (next === latestRef.current) return;
        latestRef.current = next;
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
    }

    function fromPointer(clientX: number): number {
        const rect = trackRef.current?.getBoundingClientRect();
        if (rect === undefined) return latestRef.current;
        return valueFromPointer(clientX, rect.left, rect.width, min, max, step);
    }

    function handlePointerDown(e: PointerEvent<HTMLDivElement>): void {
        if (disabled || e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        playOneShot('drag_start');
        update(fromPointer(e.clientX));
        trackRef.current?.querySelector<HTMLElement>('[role="slider"]')?.focus();
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>): void {
        if (!dragging) return;
        update(fromPointer(e.clientX));
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>): void {
        if (!dragging) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        setDragging(false);
        playOneShot('drag_end');
        onValueCommit?.(latestRef.current);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>): void {
        if (disabled) return;
        const next = valueFromKey(e.key, latestRef.current, min, max, step);
        if (next === null) return;
        e.preventDefault();
        if (next === latestRef.current) return;
        update(next);
        onValueCommit?.(next);
    }

    const hasHeader = label !== undefined || showValue;

    return (
        <div
            ref={ref}
            {...rest}
            className={cx(
                'flex flex-col gap-[6px] font-mono',
                fullWidth ? 'w-full' : 'w-[220px]',
                disabled && 'opacity-40',
                className,
            )}
            onMouseEnter={(e) => {
                if (!disabled) hoverSfx(e);
                onMouseEnter?.(e);
            }}
            data-sfx-hover="button"
        >
            {hasHeader && (
                <div className="flex items-baseline justify-between gap-[8px] text-[10px] uppercase tracking-[1px]">
                    {label !== undefined && (
                        <span id={labelId} className="text-text-secondary">
                            {label}
                        </span>
                    )}
                    {showValue && <span className="text-accent tabular-nums">{text}</span>}
                </div>
            )}
            <div
                ref={trackRef}
                className={cx(
                    'relative flex items-center touch-none select-none',
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    TRACK_CLASSES[size],
                )}
                style={{ '--slider-pct': `${toPercent(current, min, max)}%` } as CSSProperties}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <span aria-hidden="true" className="absolute inset-x-0 h-[2px] bg-border" />
                <span
                    aria-hidden="true"
                    className="absolute left-0 h-[2px] w-[var(--slider-pct)] bg-accent shadow-glow"
                />
                <span
                    role="slider"
                    tabIndex={disabled ? -1 : 0}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={current}
                    aria-valuetext={formatValue ? text : undefined}
                    aria-orientation="horizontal"
                    aria-disabled={disabled || undefined}
                    aria-labelledby={label !== undefined ? labelId : undefined}
                    aria-label={label === undefined ? ariaLabel : undefined}
                    className={cx(
                        'absolute left-[var(--slider-pct)] -translate-x-1/2 rounded-[2px] border',
                        'bg-accent-bright border-accent-bright transition-shadow duration-[150ms]',
                        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                        'focus-visible:ring-offset-1 focus-visible:ring-offset-bg',
                        dragging ? 'shadow-glow-strong' : 'shadow-glow',
                        THUMB_CLASSES[size],
                    )}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
});

Slider.displayName = 'Slider';

export default Slider;
