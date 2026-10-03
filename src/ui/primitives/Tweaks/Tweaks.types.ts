/** Theme settings edited by the `Tweaks` panel. */
export interface TweaksState {
    /** Accent hue in degrees (0–360); `useTweakApply` turns it into the `--accent*` tokens. */
    hue: number;
    /** Glow intensity (0–100); `useTweakApply` scales `--glow` and `--glow-strong` with it. */
    glow: number;
    /** Whether scanlines should be shown; read by your app, not applied by the library. */
    scan: boolean;
    /** Whether the grid background should be shown; read by your app. */
    grid: boolean;
    /** Whether the orb rings should be shown; read by your app (e.g. `CssOrb` `rings`). */
    rings: boolean;
    /** Whether the orb particles should be shown; read by your app (e.g. `CssOrb` `particles`). */
    particles: boolean;
    /** Whether the HUD should dim while idle; read by your app. */
    idleDim: boolean;
}

export interface TweaksProps {
    /** Whether the panel is visible; when `false` it renders with `display: none`. */
    open: boolean;
    /** Current settings shown in the panel (controlled). */
    tweaks: TweaksState;
    /** Called with the complete next settings object whenever a control changes. */
    onChange: (next: TweaksState) => void;
    /** Extra classes for the root `<div>` element (the fixed panel). */
    className?: string;
}

/** Props of the internal on/off row. */
export interface ToggleRowProps {
    /** Row caption; also the toggle's accessible name. */
    label: string;
    /** Whether the toggle is on. */
    value: boolean;
    /** Called when the toggle is clicked. */
    onToggle: () => void;
}

/** Props of the internal hue swatch. */
export interface SwatchButtonProps {
    /** Hue in degrees this swatch selects. */
    hue: number;
    /** Whether this hue is the current one. */
    active: boolean;
    /** Called when the swatch is clicked. */
    onSelect: () => void;
}
