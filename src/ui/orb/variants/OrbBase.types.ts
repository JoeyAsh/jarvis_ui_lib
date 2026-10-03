import type { OrbQuality, OrbVisualState } from './variants.types';

/** A preset parameter: a number or a fixed-length number array (e.g. an RGB color). */
export type OrbParamValue = number | number[];

/**
 * Shape of a variant's per-state parameters. Declare variant presets as `type` aliases (not
 * interfaces) so they satisfy the implicit index signature.
 */
export type OrbPresetShape = Record<string, OrbParamValue>;

/** Target parameters for every visual state. */
export type OrbPresets<TPreset extends OrbPresetShape> = Readonly<Record<OrbVisualState, TPreset>>;

/** Settings every quality level must define. */
export interface OrbQualitySettings {
    /** Upper bound for the renderer pixel ratio. */
    maxPixelRatio: number;
    /** Bloom resolution relative to the canvas size. */
    bloomScale: number;
}

/** Quality settings for `high` and `low`. */
export type OrbQualities<TQuality extends OrbQualitySettings> = Readonly<
    Record<OrbQuality, TQuality>
>;

/** `UnrealBloomPass` parameters: `[strength, radius, threshold]`. */
export type OrbBloomParams = readonly [strength: number, radius: number, threshold: number];
