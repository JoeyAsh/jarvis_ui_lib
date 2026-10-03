import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { Panel } from '../../primitives/Panel';
import type { GlassCardProps } from './GlassCard.types';

export function GlassCard({
    title,
    children,
    focused = false,
    className,
    bodyClassName,
}: GlassCardProps): ReactElement {
    // Panel draws the corner brackets itself (brighter and longer when focused or hovered), so the
    // wrapper only positions the card; no second bracket set.
    return (
        <div className={cx('relative inline-block', className)}>
            <Panel title={title} focused={focused} className={bodyClassName}>
                {children}
            </Panel>
        </div>
    );
}

export default GlassCard;
