import { Suspense, useEffect } from 'react';
import type { ReactElement } from 'react';
import { useLocation } from 'react-router';
import { mdxComponents } from '../mdx/mdxComponents';
import { findPage } from '../utils/navigation';
import { PageErrorBoundary } from './PageErrorBoundary';
import { PageLoading } from './PageLoading';
import type { MdxPageProps } from './MdxPage.types';

export function MdxPage({ slug, Page }: MdxPageProps): ReactElement {
    const { hash } = useLocation();

    useEffect(() => {
        const page = findPage(slug);
        document.title =
            page === undefined || slug === ''
                ? 'jarvis-react-ui · HUD components for React'
                : `${page.title} · jarvis-react-ui`;
        if (hash === '') window.scrollTo({ top: 0 });
    }, [slug, hash]);

    return (
        <PageErrorBoundary key={slug}>
            <Suspense fallback={<PageLoading />}>
                <Page components={mdxComponents} />
            </Suspense>
        </PageErrorBoundary>
    );
}

export default MdxPage;
