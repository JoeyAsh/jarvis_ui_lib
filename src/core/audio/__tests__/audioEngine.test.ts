/**
 * AudioEngine sound base URL — Vitest unit tests.
 * `AudioContext` and `fetch` are stubbed; no real audio or network is used.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioEngine } from '../audioEngine';
import { SFX_CONFIG } from '../config';

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

/** Drain the (mock-resolved) promise chains of an in-flight load without real timers. */
async function flushMicrotasks(): Promise<void> {
    for (let i = 0; i < 20; i++) await Promise.resolve();
}

/** Fire a one-shot and let the fetch/decode chain settle. */
async function playAndSettle(engine: AudioEngine, file?: string): Promise<void> {
    engine.playOneShot('click', file);
    await flushMicrotasks();
}

interface Deferred {
    promise: Promise<Response>;
    resolve: (value: Response) => void;
}

function deferred(): Deferred {
    let resolve: (value: Response) => void = () => undefined;
    const promise = new Promise<Response>((r) => {
        resolve = r;
    });
    return { promise, resolve };
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

    it('does not cache a buffer that finished loading from the old URL', async () => {
        const pending = deferred();
        fetchMock.mockReturnValueOnce(pending.promise);
        const engine = new AudioEngine();
        engine.playOneShot('click');
        await flushMicrotasks();
        engine.setSoundBaseUrl('/new/');
        pending.resolve({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as Response);
        await flushMicrotasks();

        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith(`/new/${SFX_CONFIG.click.file}`);
    });

    it('does not cache a failed old-URL load for the new URL', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        const pending = deferred();
        fetchMock.mockReturnValueOnce(pending.promise);
        const engine = new AudioEngine();
        engine.playOneShot('click');
        await flushMicrotasks();
        engine.setSoundBaseUrl('/new/');
        pending.resolve({ ok: false } as Response);
        await flushMicrotasks();

        await playAndSettle(engine);
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenLastCalledWith(`/new/${SFX_CONFIG.click.file}`);
    });

    it('rejects base URLs with a query or hash and keeps the previous URL', () => {
        const engine = new AudioEngine();
        expect(() => {
            engine.setSoundBaseUrl('/s/?v=1');
        }).toThrow(/query string or hash/);
        expect(engine.getSoundBaseUrl()).toBe('/sounds/');
    });
});
