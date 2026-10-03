import { forwardRef } from 'react';
import { cx } from '@common/utils/cx';
import type { KbdProps } from './Kbd.types';

const SIZE_CLASSES = {
    sm: 'text-[9px] px-[5px] py-[1px]',
    md: 'text-[11px] px-[7px] py-[2px]',
} as const;

/** Keyboard key chip, rendered as a semantic `<kbd>`. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
    { children, size = 'sm', className, ...rest },
    ref,
) {
    return (
        <kbd
            ref={ref}
            {...rest}
            className={cx(
                'inline-flex items-center font-mono uppercase tracking-[1px] whitespace-nowrap',
                'text-accent border border-border rounded-[2px] bg-[rgba(13,13,20,0.6)]',
                SIZE_CLASSES[size],
                className,
            )}
        >
            {children}
        </kbd>
    );
});

Kbd.displayName = 'Kbd';

export default Kbd;
