import type { DocsPage } from '../nav.types';

/** Document title of a docs page; also written into the prerendered HTML of each route. */
export function pageTitle(page: DocsPage | undefined): string {
    return page === undefined || page.slug === ''
        ? 'jarvis-react-ui · HUD components for React'
        : `${page.title} · jarvis-react-ui`;
}
