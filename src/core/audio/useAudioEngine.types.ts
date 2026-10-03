export interface UseAudioEngineOptions {
    /**
     * Base URL the SFX files are loaded from. Defaults to `/sounds/`. Accepts a relative path or an
     * absolute (CDN) URL; a trailing slash is added if missing.
     */
    soundBaseUrl?: string;
}
