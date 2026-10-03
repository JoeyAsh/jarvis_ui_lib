import type { ReactElement } from 'react';
import { ProgressBar } from '@ui';

export function PageLoading(): ReactElement {
    return (
        <div className="pt-12 max-w-[240px]" aria-busy="true">
            <span className="text-[9px] uppercase tracking-[2px] text-text-secondary">
                Loading…
            </span>
            <ProgressBar value={60} height="thin" aria-label="Loading page" />
        </div>
    );
}

export default PageLoading;
