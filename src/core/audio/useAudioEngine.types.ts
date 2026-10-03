export interface UseAudioEngineOptions {
    /**
     * Base URL the SFX files are loaded from. Defaults to `/sounds/`. Accepts a relative path or an
     * absolute (CDN) URL; a trailing slash is added if missing. Query strings and hashes are
     * rejected (an Error is thrown).
     *
     * The audio engine is a process-wide singleton: the last applied URL wins, and omitting the
     * option does NOT reset a previously set URL. The URL is applied in an effect, so set it high
     * in the tree (or call `getAudioEngine().setSoundBaseUrl()` before render) if child components
     * play sounds on mount.
     */
    soundBaseUrl?: string;

    /**
     * Mute state to start with when the user has no stored preference yet. Once the user toggles,
     * the choice is stored in `localStorage` and takes precedence on later visits.
     * @default false
     */
    initialMuted?: boolean;
}
