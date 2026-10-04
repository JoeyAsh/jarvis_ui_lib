import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
import { cx } from '@common/utils/cx';
import { useHoverSfx } from '@core/audio';
import { assignRef } from '@common/utils/assignRef';
import { autoHeight } from './utils';
import type { TextareaProps } from './Textarea.types';

const SIZE_CLASSES = {
    sm: 'px-[8px] py-[6px] text-[10px] leading-[15px]',
    md: 'px-[10px] py-[8px] text-[11px] leading-[17px]',
} as const;

/** A multi-line text field in the same hairline frame as `Input`. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    {
        size = 'md',
        invalid = false,
        fullWidth = false,
        autoResize = false,
        maxRows = 12,
        rows = 3,
        disabled,
        className,
        onChange,
        onMouseEnter,
        value,
        ...rest
    },
    ref,
) {
    const hoverSfx = useHoverSfx('button');
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [height, setHeight] = useState<number | null>(null);

    function measure(): void {
        const el = innerRef.current;
        if (!autoResize || el === null) return;
        // Collapse first so scrollHeight reflects the content, not the previous height, then write
        // the result back directly: state alone would not re-render when the height is unchanged.
        el.style.setProperty('--textarea-h', 'auto');
        const next = autoHeight(el.scrollHeight, rows, maxRows, size);
        el.style.setProperty('--textarea-h', `${next}px`);
        setHeight(next);
    }

    // Re-measure when a controlled value changes from outside.
    useLayoutEffect(measure, [value, autoResize, rows, maxRows, size]);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
        onChange?.(e);
        measure();
    }

    return (
        <textarea
            ref={(node) => {
                innerRef.current = node;
                assignRef(ref, node);
            }}
            {...rest}
            value={value}
            rows={rows}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            onChange={handleChange}
            onMouseEnter={(e) => {
                if (!disabled) hoverSfx(e);
                onMouseEnter?.(e);
            }}
            data-sfx-hover="button"
            style={
                autoResize && height !== null
                    ? ({ '--textarea-h': `${height}px` } as CSSProperties)
                    : undefined
            }
            className={cx(
                'block font-mono text-text border rounded-[2px] bg-[rgba(13,13,20,0.75)] outline-none',
                'placeholder:text-text-muted transition-[border-color,box-shadow] duration-[200ms]',
                invalid
                    ? 'border-error focus:shadow-glow-error'
                    : 'border-border hover:border-border-bright focus:border-accent focus:shadow-glow',
                disabled && 'opacity-40 cursor-not-allowed',
                fullWidth ? 'w-full' : 'w-[320px]',
                autoResize ? 'resize-none overflow-y-auto h-[var(--textarea-h)]' : 'resize-y',
                SIZE_CLASSES[size],
                className,
            )}
        />
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
