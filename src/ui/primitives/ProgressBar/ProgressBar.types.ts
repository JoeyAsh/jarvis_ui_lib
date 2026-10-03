export type ProgressBarVariant = 'accent' | 'bright' | 'warn';
export type ProgressBarHeight = 'thin' | 'normal';

export interface ProgressBarProps {
    /** Progress as a fraction from `0` to `1`; values outside that range are clamped. */
    value: number;
    /** Fill color: the accent, the brighter accent or the warning color, each with a matching glow. @default 'accent' */
    variant?: ProgressBarVariant;
    /** Track height: `thin` is 2px, `normal` is 4px. @default 'thin' */
    height?: ProgressBarHeight;
    /** Additional class names for the root `role="progressbar"` track; set its width here. */
    className?: string;
    /** Accessible name of the progress bar; set it unless a visible label is linked another way. */
    'aria-label'?: string;
}
