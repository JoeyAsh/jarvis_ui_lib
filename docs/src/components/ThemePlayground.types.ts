export interface ThemePreset {
    id: string;
    label: string;
    /** CSS custom properties applied to the preview, e.g. `{ '--accent': '#4ca8e8' }`. */
    vars: Record<string, string>;
}
