import { Suspense } from 'react';
import type { ReactElement } from 'react';
import { ComponentMetaContent } from './ComponentMetaContent';
import { DemoLoading } from './DemoLoading';
import { PageErrorBoundary } from '../layout/PageErrorBoundary';
import type { ComponentMetaProps } from './ComponentMeta.types';

/** Import statement and source links for a component page header. */
export function ComponentMeta({ component }: ComponentMetaProps): ReactElement {
    return (
        <PageErrorBoundary>
            <Suspense fallback={<DemoLoading />}>
                <ComponentMetaContent component={component} />
            </Suspense>
        </PageErrorBoundary>
    );
}

export default ComponentMeta;
