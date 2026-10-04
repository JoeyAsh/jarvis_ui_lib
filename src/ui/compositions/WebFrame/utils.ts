/** The URL if it is a valid `http:` / `https:` address, otherwise `null`. */
export function parseHttpUrl(url: string): URL | null {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : null;
    } catch {
        return null;
    }
}

/** Short form of a URL for the toolbar: host and path, without protocol and trailing slash. */
export function displayUrl(url: URL): string {
    const path = url.pathname === '/' ? '' : url.pathname;
    return `${url.host}${path}${url.search}`;
}
