import type { SearchDoc, SearchEngine, SearchResult } from '../search.types';

let enginePromise: Promise<SearchEngine> | null = null;

/** Loads MiniSearch and the page index on first use (both are lazy chunks). */
export function loadSearch(): Promise<SearchEngine> {
    enginePromise ??= Promise.all([import('minisearch'), import('virtual:search-index')]).then(
        ([{ default: MiniSearchCtor }, { default: docs }]) => {
            const engine = new MiniSearchCtor<SearchDoc>({
                fields: ['title', 'headings', 'props', 'text'],
                extractField: (doc, field) => {
                    if (field === 'headings') return doc.headings.join(' ');
                    const value = doc[field as keyof SearchDoc];
                    return typeof value === 'string' ? value : '';
                },
                searchOptions: {
                    boost: { title: 4, headings: 2, props: 1.5 },
                    prefix: true,
                    fuzzy: 0.2,
                },
            });
            engine.addAll(docs);
            return { engine, byId: new Map(docs.map((d) => [d.id, d])) };
        },
    );
    return enginePromise;
}

/** Top results for `query`, each with the first heading that matches a query term. */
export function runSearch(
    { engine, byId }: SearchEngine,
    query: string,
    limit = 8,
): SearchResult[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return engine
        .search(query)
        .flatMap((hit): SearchResult[] => {
            const doc = byId.get(String(hit.id));
            if (doc === undefined) return [];
            const heading = doc.headings.find((h) =>
                terms.some((t) => h.toLowerCase().includes(t)),
            );
            return [heading === undefined ? { doc } : { doc, heading }];
        })
        .slice(0, limit);
}
