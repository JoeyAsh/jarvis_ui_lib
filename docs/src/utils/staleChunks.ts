const RELOAD_KEY = 'jarvis-docs:stale-chunk-reload';

/** How long a reload attempt counts as "just tried", so a broken deploy can't loop forever. */
const RELOAD_GUARD_MS = 10_000;

/**
 * Whether an error comes from a lazily loaded chunk that no longer exists. After a new deploy the
 * old hashed chunk files are gone, so tabs opened before the deploy fail to load new pages.
 */
export function isStaleChunkError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
        message,
    );
}

/** Reloads the page once to pick up the new deploy; returns false if a reload was just tried. */
export function reloadForNewDeploy(): boolean {
    try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? '0');
        if (Date.now() - last < RELOAD_GUARD_MS) return false;
        sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
        // Storage blocked: still try a single reload.
    }
    window.location.reload();
    return true;
}

/** Vite fires `vite:preloadError` when a dynamic import's chunk fails to load. */
export function handleStaleChunks(): void {
    window.addEventListener('vite:preloadError', (event) => {
        if (reloadForNewDeploy()) event.preventDefault();
    });
}
