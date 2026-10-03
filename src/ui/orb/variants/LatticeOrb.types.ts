import type {
    Color,
    Group,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    RingGeometry,
    ShaderMaterial,
    Sprite,
    SpriteMaterial,
} from 'three';
import type { OrbQualitySettings } from './OrbBase.types';

/** Per-state parameters of the lattice orb. */
export type LatticePreset = {
    color: [number, number, number];
    core: number;
    breath: number;
    breathSpeed: number;
    rot: number;
    outerRot: number;
    flash: number;
    barAmp: number;
    barIdle: number;
    waveSpeed: number;
    arcSpin: [number, number, number, number];
    sweepSpeed: number;
    nodes: number;
    whiteShift: number;
    expand: number;
    accent: number;
    bloom: number;
};

export interface LatticeQuality extends OrbQualitySettings {
    /** Number of spectrum bars. */
    bars: number;
    /** Icosahedron detail of the outer lattice. */
    outerDetail: number;
}

/** A flat HUD ring definition. */
export interface HudRingDef {
    /** Radius. */
    r: number;
    /** Width. */
    w: number;
    /** Tick segments (0 = none). */
    seg: number;
    /** Tick duty cycle. */
    duty: number;
    /** Arc count (0 = none). */
    arcs: number;
    /** Arc duty cycle. */
    arcDuty: number;
    opacity: number;
    /** Uses the amber accent color. */
    accent: boolean;
    /** Highlight sweep gain. */
    sweep: number;
}

export type FacetUniforms = {
    uColor: { value: Color };
    uIntensity: { value: number };
    uFlash: { value: number };
    uTime: { value: number };
};

export type NodeUniforms = {
    uTime: { value: number };
    uSize: { value: number };
    uPixelRatio: { value: number };
    uLevel: { value: number };
    uColor: { value: Color };
    uIntensity: { value: number };
};

export type RingUniforms = {
    uInner: { value: number };
    uOuter: { value: number };
    uColor: { value: Color };
    uOpacity: { value: number };
    uSegments: { value: number };
    uDuty: { value: number };
    uArcs: { value: number };
    uArcDuty: { value: number };
    uSweepPhase: { value: number };
    uSweepGain: { value: number };
};

export type BarUniforms = {
    uTime: { value: number };
    uRadius: { value: number };
    uWidth: { value: number };
    uAmp: { value: number };
    uIdle: { value: number };
    uWavePhase: { value: number };
    uBands: { value: number[] };
    uColor: { value: Color };
    uIntensity: { value: number };
};

export interface HudRing {
    def: HudRingDef;
    mesh: Mesh<RingGeometry, ShaderMaterial>;
    uniforms: RingUniforms;
}

/** Scene objects created by `LatticeOrb.build` that `update` animates. */
export interface LatticeParts {
    root: Group;
    hud: Group;
    coreGroup: Group;
    facetUniforms: FacetUniforms;
    edgeMat: LineBasicMaterial;
    inner: LineSegments;
    innerEdgeMat: LineBasicMaterial;
    sparkMat: SpriteMaterial;
    spark: Sprite;
    lattice: Group;
    latticeMat: LineBasicMaterial;
    nodeUniforms: NodeUniforms;
    hudRings: HudRing[];
    barUniforms: BarUniforms;
}
