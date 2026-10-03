import type {
    BufferGeometry,
    Color,
    Group,
    IcosahedronGeometry,
    IUniform,
    Mesh,
    Points,
    RingGeometry,
    ShaderMaterial,
    Sprite,
    SpriteMaterial,
    Vector4,
} from 'three';

/** RGB triple (0..1 per channel). */
export type RgbTuple = [number, number, number];

/** Target animation parameters of one visual state; the orb eases between them. */
export interface ParticlePreset {
    color: RgbTuple;
    core: number;
    breath: number;
    breathSpeed: number;
    noiseAmp: number;
    noiseSpeed: number;
    jitter: number;
    bandAmp: number;
    speak: number;
    flicker: number;
    whiteShift: number;
    /** Spin speed per HUD ring (rad/s). */
    spin: [number, number, number];
    tumble: number;
    tumbleSpeed: number;
    shellSpin: number;
    bloom: number;
}

/** Keys of `ParticlePreset` holding a single number. */
export type ParticleScalarKey = Exclude<keyof ParticlePreset, 'color' | 'spin'>;

/** Per-quality build settings. */
export interface ParticleQualitySettings {
    particles: number;
    maxPixelRatio: number;
    bloomScale: number;
    coreDetail: number;
}

/** HUD ring definition. */
export interface RingDef {
    /** Radius. */
    r: number;
    /** Width. */
    w: number;
    /** Segment count (0 = solid). */
    seg: number;
    /** Lit fraction of each segment. */
    duty: number;
    /** Visible arc fraction (0..1). */
    arc: number;
    /** Base tilt around x. */
    tx: number;
    /** Base tilt around y. */
    ty: number;
    /** Highlight sweep speed. */
    sweep: number;
    opacity: number;
}

export type CoreUniforms = {
    uTime: IUniform<number>;
    uNoiseTime: IUniform<number>;
    uNoiseAmp: IUniform<number>;
    uAudio: IUniform<number>;
    uColor: IUniform<Color>;
    uIntensity: IUniform<number>;
};

export type ShellUniforms = {
    uTime: IUniform<number>;
    uNoiseTime: IUniform<number>;
    uRadius: IUniform<number>;
    uNoiseAmp: IUniform<number>;
    uJitter: IUniform<number>;
    uBandAmp: IUniform<number>;
    uBands: IUniform<number[]>;
    uShockR: IUniform<Vector4>;
    uShockA: IUniform<Vector4>;
    uSize: IUniform<number>;
    uPixelRatio: IUniform<number>;
    uColor: IUniform<Color>;
    uIntensity: IUniform<number>;
};

export type RingUniforms = {
    uInner: IUniform<number>;
    uOuter: IUniform<number>;
    uColor: IUniform<Color>;
    uOpacity: IUniform<number>;
    uSegments: IUniform<number>;
    uDuty: IUniform<number>;
    uArc: IUniform<number>;
    uSweepPhase: IUniform<number>;
};

/** Glow core: Fresnel hologram mesh plus the additive glow and spark sprites. */
export interface ParticleCore {
    mesh: Mesh<IcosahedronGeometry, ShaderMaterial>;
    uniforms: CoreUniforms;
    glow: Sprite;
    glowMat: SpriteMaterial;
    spark: Sprite;
    sparkMat: SpriteMaterial;
}

/** Particle data shell. `uniforms` is the same object as `points.material.uniforms`. */
export interface ParticleShell {
    points: Points<BufferGeometry, ShaderMaterial>;
    uniforms: ShellUniforms;
}

/** One tilted HUD ring; `def` may be replaced by subclasses (it is read every frame). */
export interface ParticleRing {
    def: RingDef;
    mesh: Mesh<RingGeometry, ShaderMaterial>;
    pivot: Group;
    uniforms: RingUniforms;
}

/** Pooled camera-facing shockwave ring. */
export interface ParticleShock {
    mesh: Mesh<RingGeometry, ShaderMaterial>;
    uniforms: RingUniforms;
    age: number;
    life: number;
    strength: number;
    active: boolean;
}

/** Per-point attributes of the Fibonacci sphere. */
export interface SphereAttributes {
    /** xyz on the unit sphere. */
    positions: Float32Array;
    /** Random 0..1 per point. */
    randoms: Float32Array;
    /** Mirrored longitude 0..1 (spectrum position). */
    bands: Float32Array;
}
