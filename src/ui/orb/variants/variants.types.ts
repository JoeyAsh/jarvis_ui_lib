import type { PerspectiveCamera, WebGLRenderer } from 'three';

/** The WebGL orb designs selectable through `ThreeOrb`'s `variant` prop (besides `constellation`). */
export type OrbVariant = 'particle' | 'halo' | 'signal' | 'reactor' | 'lattice';

/** Visual states the variant orbs animate between. */
export type OrbVisualState = 'idle' | 'listening' | 'working' | 'speaking';

/** Render quality: `low` uses fewer particles, pixel ratio 1 and half-resolution bloom. */
export type OrbQuality = 'high' | 'low';

export interface VariantOrbOptions {
    /** Render quality. @default 'high' */
    quality?: OrbQuality;
}

/** Common runtime API of every variant orb. */
export interface OrbRenderer {
    /** Eases all animation parameters toward the given state. */
    setState(state: OrbVisualState): void;
    /** Feeds audio: `level` 0..1 and up to 16 `bands` 0..1 (low → high frequencies). */
    setAudio(level: number, bands?: ArrayLike<number>): void;
    /** Per-frame hook, called before rendering with the frame time in seconds. */
    onFrame: ((dt: number) => void) | null;
    /** Camera, e.g. for orbit controls. */
    readonly camera: PerspectiveCamera;
    /** WebGL renderer; its canvas is appended to the container. */
    readonly renderer: WebGLRenderer;
    /** Re-measures the container (also done automatically through a ResizeObserver). */
    resize(): void;
    /** Stops the render loop, frees GPU resources and removes the canvas. */
    dispose(): void;
}

/** Smoothed audio passed to a variant's per-frame update. */
export interface OrbAudioFrame {
    /** Snappy level for spectra (0..1). */
    level: number;
    /** Calm envelope for glow and scale (0..1). */
    env: number;
    /** Snappy per-band levels (16 values, 0..1). */
    bands: Float32Array;
}

/** The parts of an `AnalyserNode` that `readAudio` uses (any `AnalyserNode` satisfies it). */
export interface AudioAnalyserSource {
    readonly fftSize: number;
    readonly frequencyBinCount: number;
    readonly context: { readonly sampleRate: number };
    getByteFrequencyData(array: Uint8Array<ArrayBuffer>): void;
    getFloatTimeDomainData(array: Float32Array<ArrayBuffer>): void;
}

/** Reusable buffers for reading an `AnalyserNode`. */
export interface AudioReadBuffers {
    freq: Uint8Array<ArrayBuffer>;
    time: Float32Array<ArrayBuffer>;
    bands: Float32Array;
}

/** State of the simulated voice envelope (phrases with short pauses). */
export interface VoiceSimulation {
    t: number;
    phraseEnd: number;
    pauseEnd: number;
    bands: Float32Array;
}
