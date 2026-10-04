import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { OrbBloomParams } from './OrbBase.types';

/** Options of `createOrbPipeline`. */
export interface OrbPipelineOptions {
    /** Upper bound for the renderer pixel ratio. */
    maxPixelRatio: number;
    /** `UnrealBloomPass` parameters: `[strength, radius, threshold]`. */
    bloom: OrbBloomParams;
}

/** Renderer, scene, camera and post-processing chain shared by all variant orbs. */
export interface OrbPipeline {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: PerspectiveCamera;
    composer: EffectComposer;
    bloom: UnrealBloomPass;
}
