import type { ReactNode } from 'react';

export type PillVariant = 'default' | 'ok' | 'warn' | 'err' | 'info';

export interface PillProps {
    /** Short status text shown inside the pill; rendered uppercase. */
    children: ReactNode;
    /** Status color of the text and border: neutral, success, warning, error or accent. @default 'default' */
    variant?: PillVariant;
    /** Additional class names for the root `<span>`. */
    className?: string;
}
