import { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { ScanlinesProps } from './Scanlines.types';

export function Scanlines({ children, className, sweep = false }: ScanlinesProps): ReactElement {
    return (
        <div className={cx('relative overflow-hidden', className)}>
            {children}
            {/* scanline overlay (gradient + blend mode in Scanlines.css) */}
            <span
                aria-hidden
                className="lib-scanlines__overlay pointer-events-none absolute inset-0 motion-reduce:hidden z-[1]"
            />
            {/* optional data-sweep shimmer */}
            {sweep && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden z-[2]"
                >
                    <span className="lib-scanlines__sweep absolute top-0 bottom-0 w-[40%]" />
                </span>
            )}
        </div>
    );
}

export default Scanlines;
