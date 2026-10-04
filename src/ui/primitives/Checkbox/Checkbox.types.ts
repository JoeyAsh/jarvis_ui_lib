import type { InputHTMLAttributes, ReactNode } from 'react';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'checked' | 'defaultChecked' | 'children'
> {
    /** Controlled checked state. Leave undefined to use `defaultChecked`. */
    checked?: boolean;
    /** Initial state when uncontrolled. @default false */
    defaultChecked?: boolean;
    /** Called with the new state when the user toggles the checkbox. */
    onCheckedChange?: (checked: boolean) => void;
    /**
     * Shows a dash for a mixed state, e.g. a "select all" box when only some items are selected.
     * Clicking it reports `true`.
     * @default false
     */
    indeterminate?: boolean;
    /** Visible label next to the box; also the accessible name. */
    label?: ReactNode;
    /** Box and text size. @default 'md' */
    size?: CheckboxSize;
    /** Additional class names for the root `<label>` (wraps box and label). */
    className?: string;
}
