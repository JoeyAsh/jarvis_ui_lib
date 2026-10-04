import type { TextareaHTMLAttributes } from 'react';

export type TextareaSize = 'sm' | 'md';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Font size and padding. @default 'md' */
    size?: TextareaSize;
    /** Marks the field as invalid: error border and `aria-invalid`. @default false */
    invalid?: boolean;
    /** Stretches the field to the width of its container. @default false */
    fullWidth?: boolean;
    /**
     * Grows the field with its content instead of scrolling, between `rows` and `maxRows` lines.
     * @default false
     */
    autoResize?: boolean;
    /** Upper limit for `autoResize`, in lines; the field scrolls beyond it. @default 12 */
    maxRows?: number;
    /** Visible lines; with `autoResize` the minimum height. @default 3 */
    rows?: number;
    /** Additional class names for the `<textarea>`. */
    className?: string;
}
