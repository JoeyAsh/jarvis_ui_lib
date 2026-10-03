import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputSize = 'sm' | 'md';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Height and font size of the field. @default 'md' */
    size?: InputSize;
    /** Content rendered before the text, e.g. an `Icon`. */
    startAdornment?: ReactNode;
    /** Content rendered after the text, e.g. a keyboard hint or a clear button. */
    endAdornment?: ReactNode;
    /** Marks the field as invalid: error border and `aria-invalid`. @default false */
    invalid?: boolean;
    /** Stretches the field to the width of its container. @default false */
    fullWidth?: boolean;
    /** Class name for the outer frame. */
    className?: string;
    /** Class name for the native `<input>` element. */
    inputClassName?: string;
}
