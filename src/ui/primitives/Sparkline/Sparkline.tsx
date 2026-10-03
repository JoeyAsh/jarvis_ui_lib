import type { CSSProperties, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { SparklineProps } from './Sparkline.types';
import { buildPath } from './utils';

const STROKE_CLASS = {
    accent: 'stroke-accent-bright',
    warn: 'stroke-warning',
} as const;

const FILL_CLASS = {
    accent: 'fill-accent-bright',
    warn: 'fill-warning',
} as const;

const FILL_OPACITY = {
    accent: '0.15',
    warn: '0.18',
} as const;

export function Sparkline({
    data,
    variant = 'accent',
    width = 100,
    height = 28,
    className,
    'aria-label': ariaLabel,
}: SparklineProps): ReactElement {
    const linePath = buildPath(data, width, height);

    // Close the fill path at the bottom
    let fillPath = '';
    if (linePath) {
        fillPath = `${linePath} L${width},${height} L0,${height} Z`;
    }

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className={cx('block w-full h-[var(--sparkline-height)]', className)}
            style={{ '--sparkline-height': `${height}px` } as CSSProperties}
            aria-label={ariaLabel}
            role={ariaLabel ? 'img' : undefined}
        >
            {linePath && (
                <>
                    <path
                        d={fillPath}
                        className={FILL_CLASS[variant]}
                        opacity={FILL_OPACITY[variant]}
                    />
                    <path
                        d={linePath}
                        className={STROKE_CLASS[variant]}
                        strokeWidth="1.2"
                        fill="none"
                    />
                </>
            )}
        </svg>
    );
}

export default Sparkline;
