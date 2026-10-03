import { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { GlowFrameProps } from './GlowFrame.types';

export function GlowFrame({
    children,
    breathe = false,
    strong = false,
    className,
}: GlowFrameProps): ReactElement {
    return (
        <div
            className={cx(
                'lib-glow-frame border border-[var(--accent-dim)] rounded-[2px]',
                strong && 'lib-glow-frame--strong',
                breathe && 'lib-glow-frame--breathe',
                className,
            )}
        >
            {children}
        </div>
    );
}

export default GlowFrame;
