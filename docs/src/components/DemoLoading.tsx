import type { ReactElement } from 'react';

export function DemoLoading(): ReactElement {
    return (
        <span className="text-[9px] uppercase tracking-[2px] text-text-muted" aria-busy="true">
            Loading…
        </span>
    );
}

export default DemoLoading;
