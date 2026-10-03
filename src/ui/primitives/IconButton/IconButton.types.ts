import type { ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    /** Lucide icon component to render, e.g. `Copy` from `lucide-react`. */
    icon: LucideIcon;
    /** Accessible name. Required because the button has no visible text. */
    label: string;
    /** Visual style. @default 'ghost' */
    variant?: IconButtonVariant;
    /** Square size: `sm` is 24px, `md` is 30px. @default 'md' */
    size?: IconButtonSize;
    /** Marks the button as toggled on (`aria-pressed`) and highlights it. */
    pressed?: boolean;
    /** Additional class names for the `<button>` element. */
    className?: string;
}
