import type { HTMLAttributes, ReactNode } from 'react';

export type SliderSize = 'sm' | 'md';

export interface SliderProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue' | 'children'
> {
    /** Controlled value. Leave undefined to use `defaultValue`. */
    value?: number;
    /** Initial value when uncontrolled. @default min */
    defaultValue?: number;
    /** Called with every new value while the user drags or presses a key. */
    onValueChange?: (value: number) => void;
    /** Called once with the final value when a drag ends or after a key press. */
    onValueCommit?: (value: number) => void;
    /** Lowest value. @default 0 */
    min?: number;
    /** Highest value. @default 100 */
    max?: number;
    /** Step between values; the value snaps to it. @default 1 */
    step?: number;
    /** Visible label above the track; also the accessible name of the slider. */
    label?: ReactNode;
    /** Shows the formatted value next to the label. @default false */
    showValue?: boolean;
    /** Formats the value for the readout and for `aria-valuetext`, e.g. `(v) => \`${v} %\``. */
    formatValue?: (value: number) => string;
    /** Track and thumb size. @default 'md' */
    size?: SliderSize;
    /** Stretches the slider to the width of its container instead of 220px. @default false */
    fullWidth?: boolean;
    /** Disables dragging and keyboard input. @default false */
    disabled?: boolean;
    /** Accessible name when there is no visible `label`. */
    'aria-label'?: string;
    /** Additional class names for the root element. */
    className?: string;
}
