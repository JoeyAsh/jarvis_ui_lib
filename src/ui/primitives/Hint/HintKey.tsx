import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { Kbd } from '../Kbd/Kbd';
import type { HintKeyProps } from './Hint.types';

/** Key chip inside a `Hint`; renders the `Kbd` primitive with the hint spacing. */
export function HintKey({ children, className }: HintKeyProps): ReactElement {
    return <Kbd className={cx('lib-hint__kbd', className)}>{children}</Kbd>;
}

export default HintKey;
