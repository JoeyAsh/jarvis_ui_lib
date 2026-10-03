import { BAND_COUNT, BAND_MIN_HZ, BAND_RANGE } from './constants';
import type { AudioAnalyserSource, AudioReadBuffers, VoiceSimulation } from './variants.types';

/** Buffers sized for `analyser` (reuse them across frames). */
export function createAudioBuffers(analyser: AudioAnalyserSource): AudioReadBuffers {
    return {
        freq: new Uint8Array(analyser.frequencyBinCount),
        time: new Float32Array(analyser.fftSize),
        bands: new Float32Array(BAND_COUNT),
    };
}

/**
 * Reads an `AnalyserNode`: returns the RMS level (0..1) and fills `buffers.bands` with 16
 * log-spaced bands from 80 Hz to 8 kHz.
 */
export function readAudio(analyser: AudioAnalyserSource, buffers: AudioReadBuffers): number {
    const { freq, time, bands } = buffers;
    analyser.getByteFrequencyData(freq);
    analyser.getFloatTimeDomainData(time);
    let sum = 0;
    for (const v of time) sum += v * v;
    const rms = Math.sqrt(sum / Math.max(1, time.length));
    const hzPerBin = analyser.context.sampleRate / analyser.fftSize;
    for (let b = 0; b < BAND_COUNT; b++) {
        const lo = BAND_MIN_HZ * Math.pow(BAND_RANGE, b / BAND_COUNT);
        const hi = BAND_MIN_HZ * Math.pow(BAND_RANGE, (b + 1) / BAND_COUNT);
        const i0 = Math.max(1, Math.floor(lo / hzPerBin));
        const i1 = Math.max(i0 + 1, Math.ceil(hi / hzPerBin));
        let m = 0;
        for (let i = i0; i < i1 && i < freq.length; i++) m = Math.max(m, freq[i] ?? 0);
        bands[b] = Math.pow(m / 255, 1.6);
    }
    return Math.min(1, rms * 6);
}

export function createVoiceSimulation(): VoiceSimulation {
    return { t: 0, phraseEnd: 0, pauseEnd: 0, bands: new Float32Array(BAND_COUNT) };
}

/**
 * Simulated speech for previews without a microphone: about 4.5 syllables per second inside
 * 1.5–3 s phrases with short pauses. Returns the level and fills `sim.bands`.
 */
export function simulateVoice(sim: VoiceSimulation, dt: number, loudness: number): number {
    sim.t += dt;
    const t = sim.t;
    if (t > sim.phraseEnd && t > sim.pauseEnd) {
        sim.pauseEnd = t + 0.25 + Math.random() * 0.5;
        sim.phraseEnd = sim.pauseEnd + 1.5 + Math.random() * 1.5;
    }
    const inPhrase = t > sim.pauseEnd && t < sim.phraseEnd;
    const syllable = Math.max(0, Math.sin(t * Math.PI * 2 * 4.3 + Math.sin(t * 3.1) * 1.4));
    const level = inPhrase
        ? Math.min(1, Math.pow(syllable, 0.7) * (0.55 + 0.45 * Math.sin(t * 1.7) ** 2) * loudness)
        : 0;
    for (let b = 0; b < BAND_COUNT; b++) {
        const formant = Math.exp(-Math.pow((b - 4 - 2 * Math.sin(t * 2.3)) / 3.5, 2));
        sim.bands[b] = Math.min(1, level * (0.35 + 0.9 * formant) * (0.7 + 0.3 * Math.random()));
    }
    return level;
}
