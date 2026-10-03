import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

/** Semantic variant of a `Callout`; sets the accent color and the default icon. */
export type CalloutVariant = 'info' | 'success' | 'warning' | 'error';

/** Props of the `Callout` component. */
export interface CalloutProps {
    /** Semantic color and default icon. @default 'info' */
    variant?: CalloutVariant;
    /** Bold heading line above the body. */
    title?: ReactNode;
    /** Overrides the variant icon; pass `false` to render no icon. */
    icon?: LucideIcon | false;
    /** Body content. */
    children: ReactNode;
    /** Additional class names for the root `role="note"` element. */
    className?: string;
}
