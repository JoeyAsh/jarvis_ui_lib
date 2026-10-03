import type { ReactElement } from 'react';
import { CodeBlock } from '../compositions/CodeBlock';
import type { ShowcaseCardProps } from './ShowcaseCard.types';

export function ShowcaseCard({
    label,
    code,
    children,
    dark = false,
}: ShowcaseCardProps): ReactElement {
    return (
        <div
            className={[
                'flex min-w-0 flex-col gap-3 p-4 border border-border rounded-[2px]',
                dark ? 'bg-[rgba(5,5,8,0.9)]' : 'bg-[rgba(13,13,20,0.75)]',
            ].join(' ')}
        >
            <span className="text-[9px] uppercase tracking-[1px] text-text-secondary font-mono">
                {label}
            </span>
            <div className="flex flex-1 min-w-0 items-center justify-center min-h-[48px] py-2">
                {children}
            </div>
            <CodeBlock code={code} language="tsx" className="text-[10px]" />
        </div>
    );
}

export type { ShowcaseCardProps };
export default ShowcaseCard;
