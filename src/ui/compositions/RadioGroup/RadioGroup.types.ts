import type { ReactNode } from 'react';

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export type RadioGroupSize = 'sm' | 'md';

/** One option of a `RadioGroup`. */
export interface RadioItem {
    /** Unique value of the option, reported through `onValueChange`. */
    value: string;
    /** Visible label; also the accessible name of the option. */
    label: ReactNode;
    /** Muted second line below the label. */
    description?: ReactNode;
    /** Disables the option. @default false */
    disabled?: boolean;
}

/** Props of the `RadioGroup` component. */
export interface RadioGroupProps {
    /** Options in display order. */
    items: RadioItem[];
    /** Controlled selected value. Leave undefined to use `defaultValue`. */
    value?: string;
    /** Initially selected value when uncontrolled; without it nothing is selected. */
    defaultValue?: string;
    /** Called with the new value when the user selects an option. */
    onValueChange?: (value: string) => void;
    /** Stacks the options (`vertical`) or puts them in a row (`horizontal`). @default 'vertical' */
    orientation?: RadioGroupOrientation;
    /** Dot and text size. @default 'md' */
    size?: RadioGroupSize;
    /** Disables the whole group. @default false */
    disabled?: boolean;
    /** Accessible name of the group. Use it or `aria-labelledby`. */
    'aria-label'?: string;
    /** Id of an element that names the group. */
    'aria-labelledby'?: string;
    /** Additional class names for the `role="radiogroup"` element. */
    className?: string;
}
