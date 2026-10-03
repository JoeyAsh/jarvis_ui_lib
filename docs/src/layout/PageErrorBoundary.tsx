import { Component } from 'react';
import type { ReactNode } from 'react';
import { Button, Callout } from '@ui';
import { isStaleChunkError, reloadForNewDeploy } from '../utils/staleChunks';
import type { PageErrorBoundaryProps, PageErrorBoundaryState } from './PageErrorBoundary.types';

/**
 * Keeps the layout alive when a page, demo or API table fails to load (e.g. missing generated API
 * data) and shows the error in place instead of unmounting the whole site. Chunks that vanished with
 * a new deploy trigger one automatic reload, then a reload prompt.
 */
export class PageErrorBoundary extends Component<PageErrorBoundaryProps, PageErrorBoundaryState> {
    override state: PageErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): PageErrorBoundaryState {
        return { error: error instanceof Error ? error : new Error(String(error)) };
    }

    override componentDidCatch(error: unknown): void {
        // A chunk from before the latest deploy is gone: reload once to get the new version.
        if (isStaleChunkError(error)) reloadForNewDeploy();
    }

    override render(): ReactNode {
        if (this.state.error !== null && isStaleChunkError(this.state.error)) {
            return (
                <Callout variant="info" title="The docs were updated" className="my-6">
                    <p className="m-0 mb-3">A newer version was published. Reload to continue.</p>
                    <Button size="sm" onClick={() => window.location.reload()}>
                        Reload
                    </Button>
                </Callout>
            );
        }
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
