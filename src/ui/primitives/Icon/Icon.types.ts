import type { LucideIcon } from 'lucide-react';

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps {
    /** The `lucide-react` icon component to render, e.g. `Cpu`. */
    icon: LucideIcon;
    /** Icon size: `sm` 12px, `md` 14px, `lg` 16px, with a 1.75 stroke. @default 'md' */
    size?: IconSize;
    /** Additional class names for the `<svg>` element; color it with a text color class. @default '' */
    className?: string;
    /** Accessible name for an icon that carries meaning on its own. */
    'aria-label'?: string;
    /** Hides a decorative icon from assistive technology. */
    'aria-hidden'?: boolean | 'true' | 'false';
}
