import type { ReactNode } from 'react';

export type TopBarPosition = 'fixed' | 'sticky' | 'static';

export interface TopBarProps {
    /** Content of the left slot, e.g. a clock or status text. */
    left?: ReactNode;
    /** Content of the centered slot, e.g. a title. */
    center?: ReactNode;
    /** Content of the right slot, e.g. a brand mark or actions. */
    right?: ReactNode;
    /**
     * `fixed` pins the bar 10px from the top of the viewport (HUD default), `sticky` keeps it in
     * the document flow and sticks it to the top while scrolling, `static` renders it inline.
     * @default 'fixed'
     */
    position?: TopBarPosition;
    className?: string;
}
