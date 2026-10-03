import type { ReactNode } from 'react';

export interface TabItem {
    /** Unique value identifying the tab. */
    value: string;
    /** Text of the tab button. */
    label: ReactNode;
    /** Panel content shown while the tab is selected. */
    content: ReactNode;
    /** Disables the tab. @default false */
    disabled?: boolean;
}

export interface TabsProps {
    /** Tabs in display order. */
    items: TabItem[];
    /** Controlled selected value. Leave undefined to use `defaultValue`. */
    value?: string;
    /** Initially selected value when uncontrolled. @default the first enabled tab */
    defaultValue?: string;
    /** Called with the new value when the user selects a tab. */
    onValueChange?: (value: string) => void;
    /** Accessible name of the tab list. */
    'aria-label'?: string;
    /** Content rendered at the right end of the tab bar, e.g. an `IconButton`. */
    actions?: ReactNode;
    className?: string;
    /** Class name for the panel container. */
    panelClassName?: string;
}
