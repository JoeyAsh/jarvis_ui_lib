import { DEFAULT_SOUND_BASE_URL } from './config';

/** Trim a sound base URL and ensure it ends with `/`; empty input yields the default. */
export function normalizeSoundBaseUrl(url: string): string {
    const trimmed = url.trim();
    if (trimmed === '') return DEFAULT_SOUND_BASE_URL;
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}
