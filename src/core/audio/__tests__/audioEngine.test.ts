/**
 * AudioEngine sound base URL — Vitest unit tests.
 * `AudioContext` and `fetch` are stubbed; no real audio or network is used.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioEngine } from '../audioEngine';
import { DEFAULT_SOUND_BASE_URL, SFX_CONFIG } from '../config';
import { normalizeSoundBaseUrl } from '../soundUrl';

function makeGain() {
    return {
        gain: {
            value: 1,
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            cancelScheduledValues: vi.fn(),
        },
        connect: vi.fn(),
        disconnect: vi.fn(),
    };
}

function makeSource() {
    return {
        buffer: null as AudioBuffer | null,
        connect: vi.fn(),
        disconnect: vi.fn(),
        start: vi.fn(),
        onended: null as (() => void) | null,
    };
}

class MockAudioContext {
    state = 'running';
    currentTime = 0;
    destination = {};
    createGain = vi.fn(makeGain);
    createBufferSource = vi.fn(makeSource);
    decodeAudioData = vi.fn(() => Promise.resolve({ decoded: true }));
    resume = vi.fn(() => Promise.resolve());
    close = vi.fn(() => Promise.resolve());
}

const fetchMock = vi.fn();

/** Fire a one-shot and wait until the fetch/decode chain has settled. */
async function playAndSettle(engine: AudioEngine, file?: string): Promise<void> {
    const callsBefore = fetchMock.mock.calls.length;
    engine.playOneShot('click', file);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    // Cached plays legitimately issue no fetch; callers assert on counts.
    void callsBefore;
}

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockReturnValue({ matches: false }),
    });
    vi.stubGlobal('AudioContext', MockAudioContext);
    fetchMock.mockReset();
    fetchMock.mockImplementation(() =>
        Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) }),
    );
    vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

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

    it('falls back to the default for empty input', () => {
        expect(normalizeSoundBaseUrl('  ')).toBe(DEFAULT_SOUND_BASE_URL);
    });
});

describe('AudioEngine sound base URL', () => {
    it('defaults to /sounds/ (backwards compatible)', async () => {
        const engine = new AudioEngine();
        expect(engine.getSoundBaseUrl()).toBe('/sounds/');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledWith(`/sounds/${SFX_CONFIG.click.file}`);
    });

    it('loads from a custom relative base', async () => {
        const engine = new AudioEngine();
        engine.setSoundBaseUrl('/assets/sfx/');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledWith(`/assets/sfx/${SFX_CONFIG.click.file}`);
    });

    it('loads from an absolute CDN base', async () => {
        const engine = new AudioEngine();
        engine.setSoundBaseUrl('https://unpkg.com/jarvis-react-ui@0.1.0/public/sounds/');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledWith(
            `https://unpkg.com/jarvis-react-ui@0.1.0/public/sounds/${SFX_CONFIG.click.file}`,
        );
    });

    it('normalizes a missing trailing slash', async () => {
        const engine = new AudioEngine();
        engine.setSoundBaseUrl('/assets/sfx');
        expect(engine.getSoundBaseUrl()).toBe('/assets/sfx/');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledWith(`/assets/sfx/${SFX_CONFIG.click.file}`);
    });

    it('serves repeat plays from the cache', async () => {
        const engine = new AudioEngine();
        await playAndSettle(engine);
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('invalidates the buffer cache when the base URL changes', async () => {
        const engine = new AudioEngine();
        await playAndSettle(engine);
        engine.setSoundBaseUrl('/other/');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith(`/other/${SFX_CONFIG.click.file}`);
    });

    it('keeps the cache when the normalized base URL is unchanged', async () => {
        const engine = new AudioEngine();
        await playAndSettle(engine);
        engine.setSoundBaseUrl('/sounds');
        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('uses the base URL for override files', async () => {
        const engine = new AudioEngine();
        engine.setSoundBaseUrl('/custom/');
        await playAndSettle(engine, 'click/click_2.mp3');
        expect(fetchMock).toHaveBeenCalledWith('/custom/click/click_2.mp3');
    });

    it('names the resolved URL when an override 404s', async () => {
        fetchMock.mockResolvedValue({ ok: false });
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const engine = new AudioEngine();
        engine.setSoundBaseUrl('/custom');
        await playAndSettle(engine, 'x.mp3');
        expect(warn).toHaveBeenCalledWith('[AudioEngine] 404 override at /custom/x.mp3');
    });
});
