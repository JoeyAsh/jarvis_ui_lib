import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { StatusBadgeProps, StatusBadgeState } from './StatusBadge.types';

const DOT_COLOR: Record<StatusBadgeState, string> = {
    online: 'bg-success',
    offline: 'bg-text-muted',
    warn: 'bg-warning',
};

export function StatusBadge({
    label = 'LINK · SECURE',
    state = 'online',
    pulse = true,
    className,
}: StatusBadgeProps): ReactElement {
    return (
        <span
            className={cx(
                'inline-flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[1px] text-text-secondary',
                className,
            )}
        >
            <span className="relative inline-flex items-center justify-center">
                <span
                    className={cx(
                        'block w-[6px] h-[6px] rounded-full',
                        DOT_COLOR[state],
                        // Pulse: shared keyframes jlib-status-pulse (ui.css), off for reduced motion.
                        pulse &&
                            state === 'online' &&
                            'animate-[jlib-status-pulse_0.9s_ease-in-out_infinite] motion-reduce:animate-none',
                    )}
                />
            </span>
            {label}
        </span>
    );
}

export default StatusBadge;
