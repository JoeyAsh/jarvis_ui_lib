import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import type { ToastProps } from './Toast.types';

const VARIANT_CLASSES = {
    info: 'border-l-accent',
    success: 'border-l-success',
    warning: 'border-l-warning',
    error: 'border-l-error',
} as const;

const ACCENT_TEXT_CLASSES = {
    info: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
} as const;

const BAR_CLASSES = {
    info: 'bg-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
} as const;

const ICONS = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleAlert,
} as const;

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
    {
        variant = 'info',
        title,
        description,
        action,
        onDismiss,
        duration,
        paused = false,
        className,
        ...rest
    },
    ref,
) {
    const IconComponent = ICONS[variant];
    const hasBar = duration !== undefined && Number.isFinite(duration) && duration > 0;

    return (
        <div
            ref={ref}
            {...rest}
            role={variant === 'error' ? 'alert' : 'status'}
            className={cx(
                'relative flex gap-[10px] overflow-hidden pl-[14px] pr-[6px] py-[10px]',
                'font-mono text-[11px] leading-[1.6] text-text',
                'border border-border border-l-2 rounded-[2px]',
                'bg-[rgba(13,13,20,0.92)] backdrop-blur-[12px] shadow-glow-inner',
                'animate-[winIn_300ms_cubic-bezier(0.4,0,0.2,1)_both] motion-reduce:animate-none',
                VARIANT_CLASSES[variant],
                className,
            )}
        >
            <IconComponent
                width={14}
                height={14}
                strokeWidth={1.75}
                aria-hidden="true"
                className={cx('shrink-0 mt-[3px]', ACCENT_TEXT_CLASSES[variant])}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                {title !== undefined && (
                    <span
                        className={cx(
                            'text-[10px] uppercase tracking-[1px]',
                            ACCENT_TEXT_CLASSES[variant],
                        )}
                    >
                        {title}
                    </span>
                )}
                {description !== undefined && (
                    <div className="text-text-secondary">{description}</div>
                )}
                {action !== undefined && (
                    <div className="pt-[6px]">
                        <Button size="sm" variant="ghost" onClick={action.onClick}>
                            {action.label}
                        </Button>
                    </div>
                )}
            </div>
            {onDismiss !== undefined && (
                <IconButton
                    icon={X}
                    label="Dismiss notification"
                    size="sm"
                    className="shrink-0 self-start"
                    onClick={onDismiss}
                />
            )}
            {hasBar && (
                <span
                    aria-hidden="true"
                    className={cx(
                        'absolute bottom-0 left-0 h-px w-full origin-left opacity-70',
                        'animate-[toastProgress_var(--toast-duration)_linear_forwards]',
                        'motion-reduce:animate-none',
                        paused && '[animation-play-state:paused]',
                        BAR_CLASSES[variant],
                    )}
                    style={{ '--toast-duration': `${duration}ms` } as CSSProperties}
                />
            )}
        </div>
    );
});

Toast.displayName = 'Toast';

export default Toast;
