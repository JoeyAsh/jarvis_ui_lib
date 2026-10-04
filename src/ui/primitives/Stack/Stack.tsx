import { forwardRef } from 'react';
import { cx } from '@common/utils/cx';
import { GAP_CLASSES } from './constants';
import type { StackProps } from './Stack.types';

const ALIGN_CLASSES = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
} as const;

const JUSTIFY_CLASSES = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
} as const;

/**
 * Lays out its children in a column or a row with token-based spacing. Use it instead of utility
 * classes when your project has no Tailwind.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
    {
        direction = 'column',
        gap = 'md',
        align = 'stretch',
        justify = 'start',
        wrap = false,
        className,
        children,
        ...rest
    },
    ref,
) {
    return (
        <div
            ref={ref}
            {...rest}
            className={cx(
                'flex min-w-0',
                direction === 'row' ? 'flex-row' : 'flex-col',
                wrap && 'flex-wrap',
                GAP_CLASSES[gap],
                ALIGN_CLASSES[align],
                JUSTIFY_CLASSES[justify],
                className,
            )}
        >
            {children}
        </div>
    );
});

Stack.displayName = 'Stack';

export default Stack;
