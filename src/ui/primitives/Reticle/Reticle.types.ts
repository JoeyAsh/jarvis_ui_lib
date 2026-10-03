export interface ReticleProps {
    /** Width and height of the crosshair in pixels. @default 12 */
    size?: number;
    /** Additional class names for the root `<span>`; set the line color with a text color utility, e.g. `text-text-muted`. */
    className?: string;
    /** Hides the crosshair from assistive technology; leave it on for decorative use. @default true */
    'aria-hidden'?: boolean | 'true' | 'false';
}
