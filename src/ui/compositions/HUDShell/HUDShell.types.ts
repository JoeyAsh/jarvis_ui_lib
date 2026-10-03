import type { ReactNode, CSSProperties } from 'react';

export interface HUDShellProps {
    /** Top bar slot, typically a TopBar; rendered above everything else (z-index 30). */
    topbar?: ReactNode;
    /**
     * Orb slot, typically a CssOrb or ThreeOrb; rendered in a full-screen, click-through layer
     * behind the panels.
     */
    orb?: ReactNode;
    /** Dock slot, typically a StatusDock; rendered as is, so it keeps its own fixed position. */
    dock?: ReactNode;
    /** Optional layers of the background Scene; each one is on unless set to `false`. */
    scene?: {
        /** Shows the drifting grid. @default true */
        grid?: boolean;
        /** Shows the star field. @default true */
        stars?: boolean;
        /** Shows the scanlines. @default true */
        scanlines?: boolean;
    };
    /**
     * Renders the ViewportCorners marks in the four corners.
     * @default true
     */
    viewportCorners?: boolean;
    /**
     * Renders the Reactor glow at the bottom edge.
     * @default true
     */
    reactor?: boolean;
    /**
     * Idle mode: dims and blurs the panels in `children`, makes them click-through and fades the
     * top bar.
     * @default false
     */
    idle?: boolean;
    /**
     * Adds the `is-working` class to the root element as a styling hook for tool-call activity.
     * @default false
     */
    working?: boolean;
    /** Panels and windows; rendered in a relative layer above the orb (z-index 10). */
    children?: ReactNode;
    /** Additional class names for the fixed, full-screen root `<div>`. */
    className?: string;
    /** Inline styles for the root `<div>`; use it to inject CSS custom properties. */
    style?: CSSProperties;
}
