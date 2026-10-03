export interface SceneProps {
    /** Shows the drifting background grid; the drift stops under `prefers-reduced-motion`. @default true */
    grid?: boolean;
    /** Shows a twinkling StarField (`starCount` stars); the twinkle stops under `prefers-reduced-motion`. @default true */
    stars?: boolean;
    /** Number of stars in the StarField; ignored when `stars` is false. @default 60 */
    starCount?: number;
    /** Shows the fine horizontal scanline overlay. @default true */
    scanlines?: boolean;
    /** Additional class names for the fixed, full-viewport backdrop `<div>`. */
    className?: string;
}
