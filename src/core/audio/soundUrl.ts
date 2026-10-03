import { DEFAULT_SOUND_BASE_URL } from './config';

/**
 * Trim a sound base URL and ensure it ends with `/`; empty input yields the default.
 * @throws Error if the URL contains a query string or hash (file names are appended to it).
 */
export function normalizeSoundBaseUrl(url: string): string {
    const trimmed = url.trim();
    if (trimmed === '') return DEFAULT_SOUND_BASE_URL;
    if (/[?#]/.test(trimmed)) {
        throw new Error(
            `[AudioEngine] Invalid sound base URL "${trimmed}": must not contain a query string or hash.`,
        );
    }
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}
