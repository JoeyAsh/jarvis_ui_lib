import { Suspense } from 'react';
import type { ReactElement } from 'react';
import { ApiTableContent } from './ApiTableContent';
import { DemoLoading } from './DemoLoading';
import { PageErrorBoundary } from '../layout/PageErrorBoundary';
import type { ApiTableProps } from './ApiTable.types';

/** Props table generated from the component's TypeScript types and JSDoc. */
export function ApiTable({ component }: ApiTableProps): ReactElement {
    return (
        <PageErrorBoundary>
            <Suspense fallback={<DemoLoading />}>
                <ApiTableContent component={component} />
            </Suspense>
        </PageErrorBoundary>
    );
}

export default ApiTable;
