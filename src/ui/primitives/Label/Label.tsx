import { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { LabelProps } from './Label.types';

export function Label({
    children,
    dim = false,
    className,
    htmlFor,
    ...rest
}: LabelProps): ReactElement {
    const classes = cx(
        'text-[9px] uppercase tracking-[1px] font-mono',
        dim ? 'text-text-muted' : 'text-text-secondary',
        className,
    );

    if (htmlFor) {
        return (
            <label {...rest} htmlFor={htmlFor} className={classes}>
                {children}
            </label>
        );
    }

    return (
        <span {...rest} className={classes}>
            {children}
        </span>
    );
}

export default Label;
