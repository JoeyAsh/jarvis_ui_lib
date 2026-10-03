import { Suspense, useEffect } from 'react';
import type { ReactElement } from 'react';
import { mdxComponents } from '../mdx/mdxComponents';
import { findPage } from '../utils/navigation';
import { PageErrorBoundary } from './PageErrorBoundary';
import { PageLoading } from './PageLoading';
import { ScrollToHash } from './ScrollToHash';
import type { MdxPageProps } from './MdxPage.types';

export function MdxPage({ slug, Page }: MdxPageProps): ReactElement {
    useEffect(() => {
        const page = findPage(slug);
        document.title =
            page === undefined || slug === ''
                ? 'jarvis-react-ui · HUD components for React'
                : `${page.title} · jarvis-react-ui`;
    }, [slug]);

    return (
        <PageErrorBoundary key={slug}>
            <Suspense fallback={<PageLoading />}>
                <Page components={mdxComponents} />
                <ScrollToHash />
            </Suspense>
        </PageErrorBoundary>
    );
}

export default MdxPage;
