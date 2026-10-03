import { type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { StarField } from '../StarField/StarField';
import type { SceneProps } from './Scene.types';

export function Scene({
    grid = true,
    stars = true,
    starCount = 60,
    scanlines = true,
    className,
}: SceneProps): ReactElement {
    return (
        <div className={cx('lib-scene', className)} aria-hidden="true">
            {grid && <div className="lib-scene__grid" />}
            {scanlines && <div className="lib-scene__scanlines" />}
            <div className="lib-scene__vignette" />
            <div className="lib-scene__noise" />
            <div className="lib-scene__horizon" />
            {stars && <StarField count={starCount} />}
        </div>
    );
}

export default Scene;
