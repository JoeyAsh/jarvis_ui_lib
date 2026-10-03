import { forwardRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { useClickSfx, useHoverSfx } from '@core/audio';
import type { LinkProps } from './Link.types';

const VARIANT_CLASSES = {
    accent: 'lib-link--accent',
    muted: 'lib-link--muted',
    nav: 'lib-link--nav',
} as const;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    {
        href,
        variant = 'accent',
        external = false,
        active = false,
        className,
        children,
        onClick,
        ...rest
    },
    ref,
) {
    const hoverSfx = useHoverSfx('button');
    const clickSfx = useClickSfx(onClick);

    return (
        <a
            ref={ref}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            aria-current={active ? 'page' : undefined}
            className={cx(
                'lib-link',
                VARIANT_CLASSES[variant],
                active && 'lib-link--active',
                className,
            )}
            onMouseEnter={hoverSfx}
            onClick={clickSfx}
            data-sfx-hover="button"
            {...rest}
        >
            {children}
            {external && (
                <ExternalLink width={10} height={10} strokeWidth={1.75} aria-hidden="true" />
            )}
        </a>
    );
});

Link.displayName = 'Link';

export default Link;
