import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { HintKey } from './HintKey';
import type { HintProps } from './Hint.types';

const POSITION_CLASSES = {
    'fixed-br': 'lib-hint--fixed-br',
    inline: 'inline',
} as const;

function HintRoot({ children, position = 'fixed-br', className }: HintProps): ReactElement {
    return <div className={cx('lib-hint', POSITION_CLASSES[position], className)}>{children}</div>;
}

export const Hint = Object.assign(HintRoot, { Key: HintKey });

export default Hint;
