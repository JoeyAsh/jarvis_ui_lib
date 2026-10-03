import { cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { TOOLTIP_DELAY_MS } from './constants';
import type { TooltipProps } from './Tooltip.types';

const PLACEMENT_CLASSES = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-[6px]',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-[6px]',
    left: 'right-full top-1/2 -translate-y-1/2 mr-[6px]',
    right: 'left-full top-1/2 -translate-y-1/2 ml-[6px]',
} as const;

export function Tooltip({
    content,
    children,
    placement = 'top',
    delayMs = TOOLTIP_DELAY_MS,
    disabled = false,
    className,
}: TooltipProps): ReactElement {
    const id = useId();
    const [open, setOpen] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = useCallback((): void => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => clearTimer, [clearTimer]);

    function showDelayed(): void {
        clearTimer();
        timerRef.current = setTimeout(() => setOpen(true), delayMs);
    }

    function showNow(): void {
        clearTimer();
        setOpen(true);
    }

    function hide(): void {
        clearTimer();
        setOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLSpanElement>): void {
        if (e.key === 'Escape') hide();
    }

    const visible = open && !disabled;
    const ownDescription = children.props['aria-describedby'];
    const describedBy = visible
        ? [ownDescription, id].filter((v) => v !== undefined && v !== '').join(' ')
        : ownDescription;

    return (
        <span
            role="presentation"
            className="relative inline-flex"
            onMouseEnter={showDelayed}
            onMouseLeave={hide}
            onFocus={showNow}
            onBlur={hide}
            onKeyDown={handleKeyDown}
        >
            {cloneElement(children, { 'aria-describedby': describedBy })}
            {visible && (
                <span
                    id={id}
                    role="tooltip"
                    className={cx(
                        'absolute z-[50] pointer-events-none whitespace-nowrap',
                        'px-[8px] py-[4px] rounded-[2px] border border-border-bright',
                        'bg-[rgba(13,13,20,0.92)] text-text font-mono text-[10px] tracking-[0.5px]',
                        'shadow-glow',
                        PLACEMENT_CLASSES[placement],
                        className,
                    )}
                >
                    {content}
                </span>
            )}
        </span>
    );
}

export default Tooltip;
