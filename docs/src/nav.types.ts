export type DocsGroup =
    | 'Getting started'
    | 'Customization'
    | 'Primitives'
    | 'Forms'
    | 'HUD decoration'
    | 'Voice & status'
    | 'Dev tools'
    | 'Compositions'
    | 'Charts'
    | 'Window'
    | 'Orb'
    | 'Hooks'
    | 'Utilities'
    | 'Reference';

export interface DocsPage {
    /** Route path without leading slash; `''` is the landing page. Matches the MDX file path. */
    slug: string;
    /** Sidebar label and document title. */
    title: string;
    /** Sidebar group; omit for the ungrouped top block. */
    group?: DocsGroup;
}
