export interface SceneProps {
    /** Shows the drifting background grid. @default true */
    grid?: boolean;
    /** Shows a twinkling StarField with 60 stars. @default true */
    stars?: boolean;
    /** Shows the fine horizontal scanline overlay. @default true */
    scanlines?: boolean;
    /** Additional class names for the fixed, full-viewport backdrop `<div>`. */
    className?: string;
}
