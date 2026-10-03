import type { CSSProperties, ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { CornerBracketsProps } from './CornerBrackets.types';

/** Position and border sides of each bracket; the arm length comes from `--cb-size`. */
const CORNER_CLASSES = [
    'top-[-2px] left-[-2px] border-t border-l',
    'top-[-2px] right-[-2px] border-t border-r',
    'bottom-[-2px] left-[-2px] border-b border-l',
    'bottom-[-2px] right-[-2px] border-b border-r',
] as const;

export function CornerBrackets({
    focused = false,
    size = 12,
    children,
    className,
}: CornerBracketsProps): ReactElement {
    const cornerClass = cx(
        'pointer-events-none absolute h-[var(--cb-size)] w-[var(--cb-size)] border-solid',
        'transition-[border-color,opacity] duration-200 motion-reduce:transition-none',
        focused ? 'border-accent-bright opacity-100' : 'border-accent opacity-70',
    );

    return (
        <div
            className={cx('relative', className)}
            style={{ '--cb-size': `${size}px` } as CSSProperties}
        >
            {CORNER_CLASSES.map((corner) => (
                <span key={corner} aria-hidden className={cx(cornerClass, corner)} />
            ))}
            {children}
        </div>
    );
}

export default CornerBrackets;
