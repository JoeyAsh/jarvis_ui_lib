export interface PanelBloomProps {
    /** Fades the bloom in and makes it pulse in brightness; when false it is invisible. Under `prefers-reduced-motion: reduce` it appears without fade or pulse. @default false */
    active?: boolean;
    /** Additional class names for the absolutely positioned bloom `<div>`. */
    className?: string;
}
