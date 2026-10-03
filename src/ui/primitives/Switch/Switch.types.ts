import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'children' | 'defaultChecked'
> {
    /** Controlled on/off state. Leave undefined to use `defaultChecked`. */
    checked?: boolean;
    /** Initial state when uncontrolled. @default false */
    defaultChecked?: boolean;
    /** Called with the new state when the user toggles the switch. */
    onCheckedChange?: (checked: boolean) => void;
    /** Visible label next to the track; also the accessible name. */
    label?: ReactNode;
    /** Track size. @default 'md' */
    size?: SwitchSize;
    /** Additional class names for the root `<button role="switch">` (wraps track and label). */
    className?: string;
}
