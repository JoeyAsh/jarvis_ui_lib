import type { AppOrbState } from '@common/types';

export interface StateSimulatorProps {
    /**
     * Currently selected orb state; its button is highlighted (amber for `working`) and marked
     * `aria-pressed`.
     */
    state: AppOrbState;
    /** Called with the state of the button that was clicked. */
    onChange: (state: AppOrbState) => void;
    /**
     * Caption shown before the buttons.
     * @default '◈ ORB STATE'
     */
    label?: string;
    /**
     * `fixed-top` pins the bar centred 60px below the top of the viewport; `inline` keeps it in
     * the normal document flow.
     * @default 'fixed-top'
     */
    position?: 'fixed-top' | 'inline';
    /** Extra classes for the root `<div>` element (the toolbar). */
    className?: string;
}

/** One state button of the simulator. */
export interface SimOption {
    /** Orb state the button selects. */
    key: AppOrbState;
    /** Text shown on the button. */
    label: string;
}
