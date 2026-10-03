import { forwardRef } from 'react';
import type { IconProps } from './Icon.types';

const SIZE_MAP = {
    sm: 12,
    md: 14,
    lg: 16,
} as const;

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    {
        icon: LucideIconComponent,
        size = 'md',
        className,
        'aria-label': ariaLabel,
        'aria-hidden': ariaHidden,
    },
    ref,
) {
    const px = SIZE_MAP[size];
    const labelled = ariaLabel !== undefined && ariaLabel !== '';
    return (
        <LucideIconComponent
            ref={ref}
            width={px}
            height={px}
            strokeWidth={1.75}
            className={className}
            role={labelled ? 'img' : undefined}
            aria-label={labelled ? ariaLabel : undefined}
            aria-hidden={ariaHidden ?? (labelled ? undefined : true)}
        />
    );
});

Icon.displayName = 'Icon';

export default Icon;
