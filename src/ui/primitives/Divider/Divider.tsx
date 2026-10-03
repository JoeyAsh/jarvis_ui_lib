import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { DividerProps } from './Divider.types';

const LINE_CLASSES = {
    default: 'bg-border',
    accent: 'bg-gradient-to-r from-transparent via-accent-dim to-transparent',
} as const;

const VERTICAL_LINE_CLASSES = {
    default: 'bg-border',
    accent: 'bg-gradient-to-b from-transparent via-accent-dim to-transparent',
} as const;

export function Divider({
    orientation = 'horizontal',
    variant = 'default',
    label,
    className,
}: DividerProps): ReactElement {
    if (orientation === 'vertical') {
        return (
            <div
                role="separator"
                aria-orientation="vertical"
                className={cx(
                    'w-px self-stretch shrink-0',
                    VERTICAL_LINE_CLASSES[variant],
                    className,
                )}
            />
        );
    }

    if (label !== undefined) {
        return (
            <div
                role="separator"
                aria-orientation="horizontal"
                className={cx('flex items-center gap-[10px] w-full', className)}
            >
                <span className={cx('h-px flex-1', LINE_CLASSES[variant])} />
                <span className="text-[9px] uppercase tracking-[1px] text-text-secondary font-mono">
                    {label}
                </span>
                <span className={cx('h-px flex-1', LINE_CLASSES[variant])} />
            </div>
        );
    }

    return (
        <div
            role="separator"
            aria-orientation="horizontal"
            className={cx('h-px w-full', LINE_CLASSES[variant], className)}
        />
    );
}

export default Divider;
