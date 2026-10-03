import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';
import { useSfx } from '@core/audio';
import { Toast } from '../../primitives/Toast';
import type { ToastItemProps } from './ToastProvider.types';

/**
 * One toast with its own lifetime: auto-dismisses after `duration`, pauses while hovered or
 * focused, closes on Escape and plays the variant sound when it appears.
 */
export function ToastItem({ record, defaultDuration, onDismiss }: ToastItemProps): ReactElement {
    const { id, variant = 'info', action } = record;
    const duration = record.duration ?? defaultDuration;
    const { playOneShot } = useSfx();
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const paused = hovered || focused;

    const remainingRef = useRef(duration);
    const dismiss = useCallback(() => onDismiss(id), [onDismiss, id]);

    useEffect(() => {
        if (variant === 'success') playOneShot('confirm');
        else if (variant === 'error') playOneShot('error');
    }, [variant, playOneShot]);

    useEffect(() => {
        if (paused || !Number.isFinite(duration)) return undefined;
        const startedAt = Date.now();
        const timer = setTimeout(dismiss, remainingRef.current);
        return () => {
            clearTimeout(timer);
            remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
        };
    }, [paused, duration, dismiss]);

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
        if (e.key === 'Escape') {
            e.stopPropagation();
            dismiss();
        }
    }

    return (
        <Toast
            variant={variant}
            title={record.title}
            description={record.description}
            action={
                action === undefined
                    ? undefined
                    : {
                          label: action.label,
                          onClick: () => {
                              action.onClick();
                              dismiss();
                          },
                      }
            }
            duration={duration}
            paused={paused}
            onDismiss={dismiss}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
            }}
            onKeyDown={handleKeyDown}
        />
    );
}

export default ToastItem;
