import type { ReactElement } from 'react';
import type { SectionHeaderProps } from './SectionHeader.types';

/** Title + description block shared by every showcase section. */
export function SectionHeader({ title, children }: SectionHeaderProps): ReactElement {
    return (
        <header className="flex flex-col gap-1">
            <h2 className="m-0 text-[12px] font-mono uppercase tracking-[2px] text-text">
                {title}
            </h2>
            <p className="m-0 max-w-[900px] text-[10px] leading-relaxed font-mono text-text-secondary">
                {children}
            </p>
        </header>
    );
}

export default SectionHeader;
