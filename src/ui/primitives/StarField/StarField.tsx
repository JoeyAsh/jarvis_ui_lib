import { useMemo, type CSSProperties, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { StarFieldProps, StarData } from './StarField.types';

export function StarField({ count = 60, className }: StarFieldProps): ReactElement {
    const stars = useMemo<StarData[]>(() => {
        const result: StarData[] = [];
        for (let i = 0; i < count; i++) {
            const seed = (i * 2654435761) >>> 0;
            const left = ((seed % 10000) / 100).toFixed(2);
            const top = ((((seed * 1664525 + 1013904223) >>> 0) % 10000) / 100).toFixed(2);
            const delay = ((i % 40) / 10).toFixed(1);
            result.push({ id: i, left: `${left}%`, top: `${top}%`, delay: `-${delay}s` });
        }
        return result;
    }, [count]);

    return (
        <div className={cx('lib-starfield', className)} aria-hidden="true">
            {stars.map((star) => (
                <i
                    key={star.id}
                    className="lib-starfield__star"
                    style={
                        {
                            '--star-x': star.left,
                            '--star-y': star.top,
                            '--star-delay': star.delay,
                        } as CSSProperties
                    }
                />
            ))}
        </div>
    );
}

export default StarField;
