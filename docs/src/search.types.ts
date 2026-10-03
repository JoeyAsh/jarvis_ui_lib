import type MiniSearch from 'minisearch';

/** One searchable docs page, produced at build time by docs/plugins/searchIndex.ts. */
export interface SearchDoc {
    /** Stable id (the slug, `home` for the landing page). */
    id: string;
    /** Route slug. */
    slug: string;
    title: string;
    /** Sidebar group. */
    group: string;
    /** `##` / `###` headings of the page. */
    headings: string[];
    /** Space-separated prop names of the page's component, if any. */
    props: string;
    /** Plain page text. */
    text: string;
}

/** A search hit shown in the results list. */
export interface SearchResult {
    doc: SearchDoc;
    /** First heading that matches the query, used to deep-link into the page. */
    heading?: string;
}

/** Loaded search engine plus the full documents by id (hits only carry a loosely typed id). */
export interface SearchEngine {
    engine: MiniSearch<SearchDoc>;
    byId: Map<string, SearchDoc>;
}
