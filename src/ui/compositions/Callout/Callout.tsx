import type { ReactElement } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cx } from '@common/utils/cx';
import type { CalloutProps } from './Callout.types';

const VARIANT_CLASSES = {
    info: 'border-l-accent bg-[rgba(76,168,232,0.06)]',
    success: 'border-l-success bg-[rgba(76,232,168,0.06)]',
    warning: 'border-l-warning bg-[rgba(232,178,76,0.06)]',
    error: 'border-l-error bg-[rgba(232,90,90,0.06)]',
} as const;

const ICON_COLOR_CLASSES = {
    info: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
} as const;

const DEFAULT_ICONS = {
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleAlert,
} as const;

export function Callout({
    variant = 'info',
    title,
    icon,
    children,
    className,
}: CalloutProps): ReactElement {
    const IconComponent = icon === undefined ? DEFAULT_ICONS[variant] : icon;

    return (
        <div
            role="note"
            className={cx(
                'flex gap-[10px] px-[14px] py-[10px] font-mono text-[11px] leading-[1.6] text-text',
                'border border-border border-l-2 rounded-[2px]',
                VARIANT_CLASSES[variant],
                className,
            )}
        >
            {IconComponent !== false && (
                <IconComponent
                    width={14}
                    height={14}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className={cx('shrink-0 mt-[3px]', ICON_COLOR_CLASSES[variant])}
                />
            )}
            <div className="flex flex-col gap-[2px] min-w-0">
                {title !== undefined && (
                    <span
                        className={cx(
                            'text-[10px] uppercase tracking-[1px]',
                            ICON_COLOR_CLASSES[variant],
                        )}
                    >
                        {title}
                    </span>
                )}
                <div className="text-text-secondary">{children}</div>
            </div>
        </div>
    );
}

export default Callout;
