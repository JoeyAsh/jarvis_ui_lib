import type { MouseEvent, ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Link } from '@ui';
import { hrefFor, isInternalHref } from '../utils/paths';
import type { MdxLinkProps } from './MdxLink.types';

/**
 * Markdown link: `/route` targets navigate client-side under the site base path, `http(s)` links
 * open in a new tab, `#anchors` stay as they are.
 */
export function MdxLink({ href = '', children }: MdxLinkProps): ReactElement {
    const navigate = useNavigate();

    if (isInternalHref(href)) {
        const target = href.slice(1);
        return (
            <Link
                href={hrefFor(target)}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                    e.preventDefault();
                    void navigate(`/${target}`);
                }}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link href={href} external={/^https?:/.test(href)}>
            {children}
        </Link>
    );
}

export default MdxLink;
