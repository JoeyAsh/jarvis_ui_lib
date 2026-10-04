import type { CSSProperties, ReactNode, MouseEvent, Ref, PointerEventHandler } from 'react';

export interface PanelProps {
    /** Index glyph shown before the title in the header, e.g. `◈`. */
    ix?: ReactNode;
    /** Header title. */
    title?: ReactNode;
    /** Tag shown at the right end of the header, e.g. `LIVE`. */
    badge?: ReactNode;
    /** Controls rendered in the header between the dots and the badge, e.g. icon buttons. */
    actions?: ReactNode;
    /** Highlights the panel: accent border and a stronger, animated bloom. @default false */
    focused?: boolean;
    /** Called on mouse down anywhere in the panel; use it to set `focused`. */
    onFocus?: () => void;
    /** Additional class names for the root element, e.g. width and height utilities. */
    className?: string;
    /** Inline style for the root element, e.g. `{ width: 320, height: 220 }`. */
    style?: CSSProperties;
    /** Panel body content. */
    children?: ReactNode;
    /** Ref to the header element, e.g. to measure it or attach a drag handle. */
    headerRef?: Ref<HTMLDivElement>;
    /** Pointer-down handler on the header; used as a drag handle by `Window`. */
    onHeaderPointerDown?: PointerEventHandler<HTMLDivElement>;
    /** Click handler on the header; used for double-click detection by `Window`. */
    onHeaderClick?: (e: MouseEvent<HTMLDivElement>) => void;
}
