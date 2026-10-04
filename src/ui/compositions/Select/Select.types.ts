import type { ReactNode } from 'react';

export type SelectSize = 'sm' | 'md';

/** One option of a `Select`. */
export interface SelectOption {
    /** Unique value of the option, reported through `onValueChange`. */
    value: string;
    /** Text shown in the list and, when selected, in the trigger. Also used for typeahead. */
    label: string;
    /** Icon or other content shown before the label. */
    icon?: ReactNode;
    /** Disables the option. @default false */
    disabled?: boolean;
}

/** Props of the `Select` component. */
export interface SelectProps {
    /** Options in display order. */
    options: SelectOption[];
    /** Controlled selected value. Leave undefined to use `defaultValue`. */
    value?: string;
    /** Initially selected value when uncontrolled. */
    defaultValue?: string;
    /** Called with the new value when the user picks an option. */
    onValueChange?: (value: string) => void;
    /** Text shown in the trigger while nothing is selected. @default 'Select…' */
    placeholder?: string;
    /** Height and font size of the trigger. @default 'md' */
    size?: SelectSize;
    /** Marks the field as invalid: error border and `aria-invalid`. @default false */
    invalid?: boolean;
    /** Disables the select. @default false */
    disabled?: boolean;
    /** Stretches the trigger to the width of its container. @default false */
    fullWidth?: boolean;
    /** Name for a hidden input, so the value is submitted with a surrounding `<form>`. */
    name?: string;
    /** Accessible name of the trigger. Use it or `aria-labelledby`. */
    'aria-label'?: string;
    /** Id of an element that names the select. */
    'aria-labelledby'?: string;
    /** Id of the trigger button, e.g. for a `<label htmlFor>`. */
    id?: string;
    /** Additional class names for the trigger button. */
    className?: string;
}

/** Position and width of the open list, from the trigger's viewport rect. */
export interface ListboxPosition {
    x: number;
    y: number;
    w: number;
    /** Opens above the trigger when there is not enough room below. */
    above: boolean;
}
