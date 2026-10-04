import { forwardRef } from 'react';
import type { CSSProperties } from 'react';
import { cx } from '@common/utils/cx';
import { GAP_CLASSES } from '../Stack/constants';
import type { GridProps } from './Grid.types';

const COLUMN_CLASSES = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    auto: 'grid-cols-[repeat(auto-fill,minmax(min(var(--grid-min),100%),1fr))]',
} as const;

const ALIGN_CLASSES = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
} as const;

/**
 * Lays out its children in equal columns with token-based spacing: a fixed count, or `auto` to fit
 * as many columns as the width allows.
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
    {
        columns = 'auto',
        minColumnWidth = 160,
        gap = 'md',
        align = 'stretch',
        className,
        style,
        children,
        ...rest
    },
    ref,
) {
    return (
        <div
            ref={ref}
            {...rest}
            style={
                columns === 'auto'
                    ? ({ ...style, '--grid-min': `${minColumnWidth}px` } as CSSProperties)
                    : style
            }
            className={cx(
                'grid min-w-0',
                COLUMN_CLASSES[columns],
                GAP_CLASSES[gap],
                ALIGN_CLASSES[align],
                className,
            )}
        >
            {children}
        </div>
    );
});

Grid.displayName = 'Grid';

export default Grid;
