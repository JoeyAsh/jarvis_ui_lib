import type { ReactNode } from 'react';

export interface PageErrorBoundaryProps {
    children: ReactNode;
}

export interface PageErrorBoundaryState {
    error: Error | null;
}
