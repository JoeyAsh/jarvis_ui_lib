import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual emphasis: `primary` (filled accent), `secondary` (accent outline), `ghost` (muted
     * outline) or `danger` (error outline that fills on hover).
     * @default 'secondary'
     */
    variant?: ButtonVariant;
    /** Padding and font size. @default 'md' */
    size?: ButtonSize;
    /** Additional class names for the `<button>` element. */
    className?: string;
    /** Button label, optionally combined with an icon. */
    children: ReactNode;
}
