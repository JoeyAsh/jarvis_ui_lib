import { describe, it, expect } from 'vitest';
import { createAudioBuffers, createVoiceSimulation, readAudio, simulateVoice } from '../audio';
import { BAND_COUNT } from '../constants';
import type { AudioAnalyserSource } from '../variants.types';

function fakeAnalyser(freqValue: number, timeValue: number): AudioAnalyserSource {
    return {
        fftSize: 1024,
        frequencyBinCount: 512,
        context: { sampleRate: 48000 },
        getByteFrequencyData(array) {
            array.fill(freqValue);
        },
        getFloatTimeDomainData(array) {
            array.fill(timeValue);
        },
    };
}

describe('readAudio', () => {
    it('returns silence for an empty signal', () => {
        const analyser = fakeAnalyser(0, 0);
        const buffers = createAudioBuffers(analyser);
        expect(readAudio(analyser, buffers)).toBe(0);
        expect(Array.from(buffers.bands).every((b) => b === 0)).toBe(true);
    });

    it('computes the RMS level and fills all bands', () => {
        const analyser = fakeAnalyser(255, 0.1);
        const buffers = createAudioBuffers(analyser);
        expect(readAudio(analyser, buffers)).toBeCloseTo(0.6);
        expect(buffers.bands.length).toBe(BAND_COUNT);
        expect(Array.from(buffers.bands).every((b) => b === 1)).toBe(true);
    });

    it('clamps the level to 1', () => {
        const analyser = fakeAnalyser(128, 0.9);
        expect(readAudio(analyser, createAudioBuffers(analyser))).toBe(1);
    });
});

describe('simulateVoice', () => {
    it('stays within 0..1 and produces phrases', () => {
        const sim = createVoiceSimulation();
        let max = 0;
        for (let i = 0; i < 600; i++) {
            const level = simulateVoice(sim, 1 / 60, 1);
            expect(level).toBeGreaterThanOrEqual(0);
            expect(level).toBeLessThanOrEqual(1);
            for (const b of sim.bands) {
                expect(b).toBeGreaterThanOrEqual(0);
                expect(b).toBeLessThanOrEqual(1);
            }
            max = Math.max(max, level);
        }
        expect(max).toBeGreaterThan(0.2);
    });
});
