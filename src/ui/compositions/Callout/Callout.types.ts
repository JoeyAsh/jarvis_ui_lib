import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export type CalloutVariant = 'info' | 'success' | 'warning' | 'error';

export interface CalloutProps {
    /** Semantic color and default icon. @default 'info' */
    variant?: CalloutVariant;
    /** Bold heading line above the body. */
    title?: ReactNode;
    /** Overrides the variant icon; pass `false` to render no icon. */
    icon?: LucideIcon | false;
    /** Body content. */
    children: ReactNode;
    className?: string;
}
