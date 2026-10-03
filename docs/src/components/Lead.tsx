import type { ReactElement } from 'react';
import type { LeadProps } from './Lead.types';

/**
 * Intro paragraph under a page title. Renders a `div`, because MDX wraps multi-line text in its
 * own `<p>` and a `<p>` inside a `<p>` is invalid HTML.
 */
export function Lead({ children }: LeadProps): ReactElement {
    return (
        <div className="mt-2 mb-6 [&_p]:m-0 [&_p]:text-[13px] [&_p]:leading-[1.7] [&_p]:text-text-secondary max-w-[720px] text-[13px] leading-[1.7] text-text-secondary">
            {children}
        </div>
    );
}

export default Lead;
