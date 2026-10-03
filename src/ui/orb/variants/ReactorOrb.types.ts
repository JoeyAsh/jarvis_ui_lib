import type { BoxGeometry, Group, Mesh, MeshBasicMaterial, SpriteMaterial } from 'three';
import type { OrbQualitySettings } from './OrbBase.types';

/** Per-state parameters of the reactor orb. */
export type ReactorPreset = {
    speed: number;
    gain: number;
    audio: number;
    work: number;
    breath: number;
};

export interface ReactorQuality extends OrbQualitySettings {
    /** Ring segment budget (also drives the core sphere resolution). */
    segments: number;
}

export interface ReactorRotor {
    pivot: Group;
    rotor: Group;
    material: MeshBasicMaterial;
}

/** Uniforms of the core hologram shader. */
export type ReactorCoreUniforms = {
    uTime: { value: number };
    uGain: { value: number };
    uWork: { value: number };
};

/** Scene objects created by `ReactorOrb.build` that `update` animates. */
export interface ReactorParts {
    root: Group;
    rotors: ReactorRotor[];
    coreUniforms: ReactorCoreUniforms;
    iris: Mesh<BoxGeometry, MeshBasicMaterial>[];
    glowMaterial: SpriteMaterial;
}
