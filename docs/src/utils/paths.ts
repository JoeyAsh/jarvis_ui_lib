/** GitHub repository the docs link to (source files, edit links). */
export const REPO_URL = 'https://github.com/JoeyAsh/jarvis_ui_lib';

/** Router basename without trailing slash, e.g. `/jarvis_ui_lib`. */
export function routerBasename(): string {
    return import.meta.env.BASE_URL.replace(/\/$/, '');
}

/** Absolute href for an in-app route (`components/button` → `/jarvis_ui_lib/components/button`). */
export function hrefFor(slug: string): string {
    return `${import.meta.env.BASE_URL}${slug}`;
}

/** Route slug for a page file key from `import.meta.glob('./pages/**\/*.mdx')`. */
export function slugFromPageKey(key: string): string {
    const path = key.replace(/^\.\/pages\//, '').replace(/\.mdx$/, '');
    return path === 'index' ? '' : path;
}

/** Link to a repo file on GitHub (`src/ui/...` → blob URL on main). */
export function sourceUrl(file: string): string {
    return `${REPO_URL}/blob/main/${file}`;
}

/** Whether an MDX link target is an in-app route rather than an external URL or anchor. */
export function isInternalHref(href: string): boolean {
    return href.startsWith('/') && !href.startsWith('//');
}
