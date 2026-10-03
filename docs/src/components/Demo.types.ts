export type DemoAlign = 'center' | 'start' | 'stretch';
export type DemoHeight = 'auto' | 'tall';

export interface DemoProps {
    /** Demo path below `docs/src/demos/` without extension, e.g. `button/Variants`. */
    name: string;
    /** Placement of the preview content. @default 'center' */
    align?: DemoAlign;
    /** `tall` gives fixed-position HUD pieces (windows, overlays) a 420px stage. @default 'auto' */
    height?: DemoHeight;
    /** Shows the code without clicking the toggle. @default false */
    defaultExpanded?: boolean;
}
