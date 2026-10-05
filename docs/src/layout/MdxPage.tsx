import { Suspense, useEffect } from 'react';
import type { ReactElement } from 'react';
import { mdxComponents } from '../mdx/mdxComponents';
import { findPage } from '../utils/navigation';
import { pageTitle } from '../utils/pageTitle';
import { PageErrorBoundary } from './PageErrorBoundary';
import { PageLoading } from './PageLoading';
import { ScrollToHash } from './ScrollToHash';
import type { MdxPageProps } from './MdxPage.types';

export function MdxPage({ slug, Page }: MdxPageProps): ReactElement {
    useEffect(() => {
        document.title = pageTitle(findPage(slug));
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
