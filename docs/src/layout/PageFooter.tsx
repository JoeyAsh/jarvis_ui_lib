import type { MouseEvent, ReactElement } from 'react';
import { useNavigate } from 'react-router';
import { Divider, Link } from '@ui';
import { findPage, neighbours } from '../utils/navigation';
import { hrefFor, REPO_URL } from '../utils/paths';
import type { PageFooterProps } from './PageFooter.types';

export function PageFooter({ slug }: PageFooterProps): ReactElement | null {
    const navigate = useNavigate();
    if (findPage(slug) === undefined) return null;

    const { prev, next } = neighbours(slug);
    const file = `docs/src/pages/${slug === '' ? 'index' : slug}.mdx`;

    function go(target: string) {
        return (e: MouseEvent<HTMLAnchorElement>): void => {
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;
            e.preventDefault();
            void navigate(`/${target}`);
        };
    }

    return (
        <footer className="mt-16 flex flex-col gap-6">
            <Divider variant="accent" />
            <div className="flex flex-wrap items-start justify-between gap-4 text-[11px]">
                <div className="flex flex-col gap-1">
                    {prev && (
                        <>
                            <span className="text-[9px] uppercase tracking-[1px] text-text-muted">
                                Previous
                            </span>
                            <Link href={hrefFor(prev.slug)} onClick={go(prev.slug)}>
                                ← {prev.title}
                            </Link>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                    {next && (
                        <>
                            <span className="text-[9px] uppercase tracking-[1px] text-text-muted">
                                Next
                            </span>
                            <Link href={hrefFor(next.slug)} onClick={go(next.slug)}>
                                {next.title} →
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <Link
                href={`${REPO_URL}/edit/main/${file}`}
                external
                variant="muted"
                className="text-[10px]"
            >
                Edit this page on GitHub
            </Link>
        </footer>
    );
}

export default PageFooter;
