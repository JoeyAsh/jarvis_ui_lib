import { Component } from 'react';
import type { ReactNode } from 'react';
import { Callout } from '@ui';
import type { PageErrorBoundaryProps, PageErrorBoundaryState } from './PageErrorBoundary.types';

/**
 * Keeps the layout alive when a page, demo or API table fails to load (e.g. missing generated API
 * data) and shows the error in place instead of unmounting the whole site.
 */
export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
    override state: PageErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): PageErrorBoundaryState {
        return { error: error instanceof Error ? error : new Error(String(error)) };
    }

    override render(): ReactNode {
        if (this.state.error !== null) {
            return (
                <Callout variant="error" title="This section failed to load" className="my-6">
                    {this.state.error.message}
                </Callout>
            );
        }
        return this.props.children;
    }
}

export default PageErrorBoundary;
