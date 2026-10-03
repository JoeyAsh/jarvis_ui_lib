import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { slugify, textContent } from '../utils/text';
import type { MdxHeadingProps } from './MdxHeading.types';

const LEVEL_CLASSES = {
    1: 'mt-6 mb-0 text-[24px] sm:text-[28px] font-medium tracking-[1px] text-text',
    2: 'mt-12 mb-3 pb-2 border-b border-border text-[16px] font-medium tracking-[1px] text-text',
    3: 'mt-8 mb-2 text-[13px] font-medium tracking-[1px] text-accent-bright',
} as const;

/** Page heading; h2/h3 get an id and a hover anchor so sections can be linked. */
export function MdxHeading({ level, children }: MdxHeadingProps): ReactElement {
    const Tag = `h${level}` as const;
    const id = level === 1 ? undefined : slugify(textContent(children));

    return (
        <Tag id={id} className={cx('group scroll-mt-[80px]', LEVEL_CLASSES[level])}>
            {children}
            {id !== undefined && (
                <a
                    href={`#${id}`}
                    aria-label="Link to this section"
                    className="docs-anchor ml-2 text-text-muted opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    #
                </a>
            )}
        </Tag>
    );
}

export default MdxHeading;
