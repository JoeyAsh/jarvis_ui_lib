import { describe, expect, it } from 'vitest';
import { DEFAULT_SOUND_BASE_URL } from '../config';
import { normalizeSoundBaseUrl } from '../soundUrl';

describe('normalizeSoundBaseUrl', () => {
    it('adds a missing trailing slash', () => {
        expect(normalizeSoundBaseUrl('/audio')).toBe('/audio/');
        expect(normalizeSoundBaseUrl('https://cdn.example.com/s')).toBe(
            'https://cdn.example.com/s/',
        );
    });

    it('keeps an existing trailing slash', () => {
        expect(normalizeSoundBaseUrl('/audio/')).toBe('/audio/');
    });

    it('trims whitespace', () => {
        expect(normalizeSoundBaseUrl('  /audio  ')).toBe('/audio/');
    });

    it('falls back to the default for empty or whitespace input', () => {
        expect(normalizeSoundBaseUrl('')).toBe(DEFAULT_SOUND_BASE_URL);
        expect(normalizeSoundBaseUrl('   ')).toBe(DEFAULT_SOUND_BASE_URL);
    });

    it('rejects query strings and hashes', () => {
        expect(() => normalizeSoundBaseUrl('/s/?v=1')).toThrow(/query string or hash/);
        expect(() => normalizeSoundBaseUrl('/s/#x')).toThrow(/query string or hash/);
    });

    it('passes protocol-relative and ./relative URLs through', () => {
        expect(normalizeSoundBaseUrl('//cdn.example.com/s')).toBe('//cdn.example.com/s/');
        expect(normalizeSoundBaseUrl('./sfx')).toBe('./sfx/');
    });
});
