import type { ReactNode } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'default' | 'accent';

export interface DividerProps {
    /** Direction of the line. A vertical divider stretches to the height of its flex row. @default 'horizontal' */
    orientation?: DividerOrientation;
    /** `accent` draws a fading accent-colored line instead of the border color. @default 'default' */
    variant?: DividerVariant;
    /** Optional caption centered in a horizontal divider. */
    label?: ReactNode;
    /** Additional class names for the root `role="separator"` element (the row when labelled). */
    className?: string;
}
