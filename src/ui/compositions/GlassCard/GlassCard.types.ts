import type { ReactNode } from 'react';

export interface GlassCardProps {
    /** Header title of the inner Panel; without it the panel has no header strip. */
    title?: string;
    /** Content of the panel body. */
    children?: ReactNode;
    /**
     * Brightens the corner brackets and switches the panel to its focused look (accent border and
     * bloom). Purely visual; it does not move keyboard focus.
     * @default false
     */
    focused?: boolean;
    /** Additional class names for the outer corner-bracket wrapper `<div>` (an `inline-block`). */
    className?: string;
    /** Additional class names for the inner Panel's root element, e.g. its width and height. */
    bodyClassName?: string;
}
