/**
 * LatticeOrb: geometric HUD variant. Faceted crystal core with flashing facets and glowing
 * edges, counter-rotating geodesic lattice with nodes, camera-facing HUD plane (tick rings,
 * segmented arcs, amber accent) and a circular 128-bar audio spectrum.
 */
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    DoubleSide,
    EdgesGeometry,
    Group,
    IcosahedronGeometry,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    Points,
    RingGeometry,
    ShaderMaterial,
    Sprite,
    SpriteMaterial,
} from 'three';
import { BAND_COUNT } from './constants';
import { makeGlowTexture } from './glowTexture';
import { lerp, OrbBase } from './OrbBase';
import type { OrbPresets, OrbQualities } from './OrbBase.types';
import type {
    BarUniforms,
    FacetUniforms,
    HudRing,
    HudRingDef,
    LatticeParts,
    LatticePreset,
    LatticeQuality,
    NodeUniforms,
    RingUniforms,
} from './LatticeOrb.types';
import type { OrbAudioFrame, VariantOrbOptions } from './variants.types';

const PRESETS: OrbPresets<LatticePreset> = {
    idle: {
        color: [0.0, 0.8, 1.0],
        core: 0.8,
        breath: 0.02,
        breathSpeed: 1.2,
        rot: 0.12,
        outerRot: -0.06,
        flash: 0.0,
        barAmp: 0.0,
        barIdle: 0.035,
        waveSpeed: 1.0,
        arcSpin: [0.15, -0.1, 0.06, 0.25],
        sweepSpeed: 0.15,
        nodes: 0.8,
        whiteShift: 0.0,
        expand: 0.0,
        accent: 0.6,
        bloom: 0.9,
    },
    listening: {
        color: [0.1, 0.95, 1.0],
        core: 1.0,
        breath: 0.01,
        breathSpeed: 1.0,
        rot: 0.18,
        outerRot: -0.09,
        flash: 0.0,
        barAmp: 0.38,
        barIdle: 0.01,
        waveSpeed: 1.0,
        arcSpin: [0.25, -0.18, 0.1, 0.4],
        sweepSpeed: 0.3,
        nodes: 1.15,
        whiteShift: 0.0,
        expand: 0.0,
        accent: 0.8,
        bloom: 1.0,
    },
    working: {
        color: [0.3, 0.6, 1.0],
        core: 1.1,
        breath: 0.006,
        breathSpeed: 3.0,
        rot: 0.9,
        outerRot: -0.6,
        flash: 0.14,
        barAmp: 0.0,
        barIdle: 0.05,
        waveSpeed: 6.0,
        arcSpin: [1.6, -2.2, 1.1, 2.8],
        sweepSpeed: 1.2,
        nodes: 1.2,
        whiteShift: 0.35,
        expand: 0.04,
        accent: 1.2,
        bloom: 1.1,
    },
    speaking: {
        color: [0.2, 0.85, 1.0],
        core: 1.0,
        breath: 0.008,
        breathSpeed: 1.2,
        rot: 0.15,
        outerRot: -0.08,
        flash: 0.0,
        barAmp: 0.18,
        barIdle: 0.012,
        waveSpeed: 1.0,
        arcSpin: [0.2, -0.14, 0.08, 0.3],
        sweepSpeed: 0.25,
        nodes: 1.0,
        whiteShift: 0.0,
        expand: 0.0,
        accent: 0.8,
        bloom: 0.95,
    },
};

const QUALITY: OrbQualities<LatticeQuality> = {
    high: { maxPixelRatio: 2, bloomScale: 1.0, bars: 128, outerDetail: 2 },
    low: { maxPixelRatio: 1, bloomScale: 0.5, bars: 72, outerDetail: 1 },
};

const ACCENT = new Color(1.0, 0.62, 0.18);

// ---------- Crystal core: flat-shaded facets with Fresnel and random facet flashes ----------

const FACET_VERT = /* glsl */ `
attribute float aFace;
varying vec3 vViewPos;
varying float vFace;
void main(){
  vFace = aFace;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FACET_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uFlash;
uniform float uTime;
varying vec3 vViewPos;
varying float vFace;
float hash(float n){ return fract(sin(n) * 43758.5453); }
void main(){
  vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
  vec3 v = normalize(-vViewPos);
  float facing = abs(dot(n, v));
  float fresnel = pow(1.0 - facing, 2.0);
  float flash = step(1.0 - uFlash, hash(vFace * 17.0 + floor(uTime * 7.0)));
  float shade = 0.025 + 0.09 * facing * facing + fresnel * 0.32 + flash * 0.6;
  gl_FragColor = vec4(uColor * shade * uIntensity, 1.0);
}
`;

// ---------- Lattice nodes ----------

const NODE_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform float uLevel;
attribute float aRandom;
varying float vBright;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vec3 nv = normalize(normalMatrix * normalize(position));
  float back = nv.z < 0.0 ? 0.35 : 1.0;
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aRandom * 2.0) + aRandom * 40.0);
  vBright = back * twinkle;
  gl_PointSize = uSize * (0.7 + 0.6 * aRandom) * (1.0 + uLevel * 0.6) * uPixelRatio / -mv.z;
}
`;

const NODE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying float vBright;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.18, 0.0, d);
  float halo = smoothstep(0.5, 0.0, d) * 0.35;
  float a = core + halo;
  gl_FragColor = vec4(uColor * vBright * uIntensity * (core * 1.6 + halo), a);
}
`;

// ---------- HUD rings (flat, in the camera-facing plane) ----------

const RING_VERT = /* glsl */ `
uniform float uInner;
uniform float uOuter;
varying float vAngle;
varying float vRadial;
void main(){
  vAngle = atan(position.y, position.x);
  vRadial = (length(position.xy) - uInner) / (uOuter - uInner);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const RING_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uSegments;
uniform float uDuty;
uniform float uArcs;
uniform float uArcDuty;
uniform float uSweepPhase;
uniform float uSweepGain;
varying float vAngle;
varying float vRadial;
void main(){
  float a = vAngle / 6.2831853 + 0.5;
  float ticks = uSegments > 0.5 ? step(fract(a * uSegments), uDuty) : 1.0;
  float arcs = uArcs > 0.5 ? step(fract(a * uArcs), uArcDuty) : 1.0;
  float sweep = pow(fract(a - uSweepPhase), 14.0) * uSweepGain;
  float edge = smoothstep(0.0, 0.35, 1.0 - abs(vRadial * 2.0 - 1.0));
  float alpha = ticks * arcs * edge * uOpacity;
  gl_FragColor = vec4(uColor * (0.6 + 2.0 * sweep), alpha);
}
`;

const HUD_RINGS: readonly HudRingDef[] = [
    {
        r: 1.2,
        w: 0.006,
        seg: 0,
        duty: 1,
        arcs: 0,
        arcDuty: 1,
        opacity: 0.5,
        accent: false,
        sweep: 1,
    },
    {
        r: 1.27,
        w: 0.035,
        seg: 180,
        duty: 0.12,
        arcs: 0,
        arcDuty: 1,
        opacity: 0.4,
        accent: false,
        sweep: 0.5,
    },
    {
        r: 1.6,
        w: 0.01,
        seg: 0,
        duty: 1,
        arcs: 3,
        arcDuty: 0.78,
        opacity: 0.7,
        accent: false,
        sweep: 1,
    },
    {
        r: 1.67,
        w: 0.016,
        seg: 0,
        duty: 1,
        arcs: 1,
        arcDuty: 0.12,
        opacity: 0.85,
        accent: true,
        sweep: 0,
    },
];

// ---------- Circular spectrum ----------

const BARS_VERT = /* glsl */ `
uniform float uTime;
uniform float uRadius;
uniform float uWidth;
uniform float uAmp;
uniform float uIdle;
uniform float uWavePhase;
uniform float uBands[${String(BAND_COUNT)}];
attribute vec2 aCorner;
attribute float aAngle;
varying float vT;
varying float vVal;
void main(){
  // Mirror the spectrum around the vertical axis: lows at the bottom, highs at the top.
  float f = abs(fract(aAngle / 6.2831853 + 0.25) * 2.0 - 1.0);
  f = 1.0 - f;
  float fi = f * float(${String(BAND_COUNT - 1)});
  int i0 = int(floor(fi));
  int i1 = min(i0 + 1, ${String(BAND_COUNT - 1)});
  float band = mix(uBands[i0], uBands[i1], fract(fi));
  float idle = uIdle * (0.5 + 0.5 * sin(aAngle * 6.0 + uWavePhase));
  float val = band * uAmp + idle;
  float len = 0.015 + val;
  vec2 dir = vec2(cos(aAngle), sin(aAngle));
  vec2 tang = vec2(-dir.y, dir.x);
  vec2 p = dir * (uRadius + aCorner.y * len) + tang * aCorner.x * uWidth;
  vT = aCorner.y;
  vVal = val;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
}
`;

const BARS_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying float vT;
varying float vVal;
void main(){
  float a = (0.35 + 0.65 * vT) * uIntensity;
  gl_FragColor = vec4(uColor * (0.5 + vT * 0.8 + vVal * 1.5), a);
}
`;

/** Deduplicated vertex positions (rounded to 4 decimals) of `geometry`. */
function uniqueVertices(geometry: BufferGeometry): Float32Array {
    const pos = geometry.getAttribute('position');
    const seen = new Set<string>();
    const out: number[] = [];
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const key = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
        if (!seen.has(key)) {
            seen.add(key);
            out.push(x, y, z);
        }
    }
    return new Float32Array(out);
}

export class LatticeOrb extends OrbBase<LatticePreset, LatticeQuality, LatticeParts> {
    private breathPhase = 0;
    private wavePhase = 0;
    private sweepPhase = 0;
    private readonly color = new Color();

    constructor(container: HTMLElement, options: VariantOrbOptions = {}) {
        super(container, options, PRESETS, QUALITY, [0.8, 0.3, 0.12]);
    }

    protected build(q: LatticeQuality): LatticeParts {
        const root = new Group();
        this.scene.add(root);
        const hud = new Group();
        this.scene.add(hud);

        const core = this.buildCore(root);
        const lattice = this.buildLattice(root, q);
        const hudRings = this.buildHud(hud);
        const barUniforms = this.buildBars(hud, q);

        return { root, hud, ...core, ...lattice, hudRings, barUniforms };
    }

    private buildCore(
        root: Group,
    ): Pick<
        LatticeParts,
        'coreGroup' | 'facetUniforms' | 'edgeMat' | 'inner' | 'innerEdgeMat' | 'sparkMat' | 'spark'
    > {
        const coreGroup = new Group();
        root.add(coreGroup);

        const geo = new IcosahedronGeometry(0.62, 1);
        const faces = new Float32Array(geo.getAttribute('position').count);
        for (let i = 0; i < faces.length; i += 3) {
            faces[i] = faces[i + 1] = faces[i + 2] = i / 3;
        }
        geo.setAttribute('aFace', new BufferAttribute(faces, 1));

        const facetUniforms: FacetUniforms = {
            uColor: { value: new Color() },
            uIntensity: { value: 1 },
            uFlash: { value: 0 },
            uTime: { value: 0 },
        };
        const facets = new Mesh(
            geo,
            new ShaderMaterial({
                uniforms: facetUniforms,
                vertexShader: FACET_VERT,
                fragmentShader: FACET_FRAG,
                transparent: true,
                depthWrite: false,
                blending: AdditiveBlending,
            }),
        );
        coreGroup.add(facets);

        const edgeMat = new LineBasicMaterial({
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        const edges = new LineSegments(new EdgesGeometry(geo, 1), edgeMat);
        edges.scale.setScalar(1.002);
        coreGroup.add(edges);

        // Inner second crystal, rotated against the outer one.
        const innerEdgeMat = edgeMat.clone();
        const inner = new LineSegments(
            new EdgesGeometry(new IcosahedronGeometry(0.3, 0), 1),
            innerEdgeMat,
        );
        root.add(inner);

        // Small hot center.
        const sparkMat = new SpriteMaterial({
            map: makeGlowTexture(),
            blending: AdditiveBlending,
            depthWrite: false,
            transparent: true,
        });
        const spark = new Sprite(sparkMat);
        spark.scale.setScalar(0.5);
        root.add(spark);

        return { coreGroup, facetUniforms, edgeMat, inner, innerEdgeMat, sparkMat, spark };
    }

    private buildLattice(
        root: Group,
        q: LatticeQuality,
    ): Pick<LatticeParts, 'lattice' | 'latticeMat' | 'nodeUniforms'> {
        const lattice = new Group();
        root.add(lattice);

        const geo = new IcosahedronGeometry(1.0, q.outerDetail);
        const latticeMat = new LineBasicMaterial({
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
            opacity: 0.22,
        });
        lattice.add(new LineSegments(new EdgesGeometry(geo, 1), latticeMat));

        const nodes = uniqueVertices(geo);
        const randoms = new Float32Array(nodes.length / 3).map(() => Math.random());
        const ngeo = new BufferGeometry();
        ngeo.setAttribute('position', new BufferAttribute(nodes, 3));
        ngeo.setAttribute('aRandom', new BufferAttribute(randoms, 1));
        const nodeUniforms: NodeUniforms = {
            uTime: { value: 0 },
            uSize: { value: 48 },
            uPixelRatio: { value: this.renderer.getPixelRatio() },
            uLevel: { value: 0 },
            uColor: { value: new Color() },
            uIntensity: { value: 1 },
        };
        lattice.add(
            new Points(
                ngeo,
                new ShaderMaterial({
                    uniforms: nodeUniforms,
                    vertexShader: NODE_VERT,
                    fragmentShader: NODE_FRAG,
                    transparent: true,
                    depthWrite: false,
                    blending: AdditiveBlending,
                }),
            ),
        );

        return { lattice, latticeMat, nodeUniforms };
    }

    private buildHud(hud: Group): HudRing[] {
        return HUD_RINGS.map((def) => {
            const inner = def.r - def.w / 2;
            const outer = def.r + def.w / 2;
            const uniforms: RingUniforms = {
                uInner: { value: inner },
                uOuter: { value: outer },
                uColor: { value: new Color() },
                uOpacity: { value: def.opacity },
                uSegments: { value: def.seg },
                uDuty: { value: def.duty },
                uArcs: { value: def.arcs },
                uArcDuty: { value: def.arcDuty },
                uSweepPhase: { value: 0 },
                uSweepGain: { value: def.sweep },
            };
            const mesh = new Mesh(
                new RingGeometry(inner, outer, 256, 1),
                new ShaderMaterial({
                    uniforms,
                    vertexShader: RING_VERT,
                    fragmentShader: RING_FRAG,
                    transparent: true,
                    depthWrite: false,
                    side: DoubleSide,
                    blending: AdditiveBlending,
                }),
            );
            mesh.rotation.z = Math.random() * Math.PI * 2;
            hud.add(mesh);
            return { def, mesh, uniforms };
        });
    }

    private buildBars(hud: Group, q: LatticeQuality): BarUniforms {
        const n = q.bars;
        const corners: number[] = [];
        const angles: number[] = [];
        const index: number[] = [];
        for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2;
            corners.push(-0.5, 0, 0.5, 0, 0.5, 1, -0.5, 1);
            angles.push(ang, ang, ang, ang);
            const b = i * 4;
            index.push(b, b + 1, b + 2, b, b + 2, b + 3);
        }
        const geo = new BufferGeometry();
        // position is required by three.js; the shader builds the real position from aCorner/aAngle.
        geo.setAttribute('position', new BufferAttribute(new Float32Array(n * 12), 3));
        geo.setAttribute('aCorner', new BufferAttribute(new Float32Array(corners), 2));
        geo.setAttribute('aAngle', new BufferAttribute(new Float32Array(angles), 1));
        geo.setIndex(index);

        const barUniforms: BarUniforms = {
            uTime: { value: 0 },
            uRadius: { value: 1.36 },
            uWidth: { value: ((Math.PI * 2 * 1.36) / n) * 0.45 },
            uAmp: { value: 0 },
            uIdle: { value: 0 },
            uWavePhase: { value: 0 },
            uBands: { value: new Array<number>(BAND_COUNT).fill(0) },
            uColor: { value: new Color() },
            uIntensity: { value: 1 },
        };
        const bars = new Mesh(
            geo,
            new ShaderMaterial({
                uniforms: barUniforms,
                vertexShader: BARS_VERT,
                fragmentShader: BARS_FRAG,
                transparent: true,
                depthWrite: false,
                side: DoubleSide,
                blending: AdditiveBlending,
            }),
        );
        bars.frustumCulled = false;
        hud.add(bars);
        return barUniforms;
    }

    protected update(dt: number, t: number, p: LatticePreset, audio: OrbAudioFrame): void {
        const {
            root,
            hud,
            coreGroup,
            facetUniforms,
            edgeMat,
            inner,
            innerEdgeMat,
            sparkMat,
            spark,
            lattice,
            latticeMat,
            nodeUniforms,
            hudRings,
            barUniforms,
        } = this.parts;
        const env = audio.env;

        this.breathPhase += dt * p.breathSpeed;
        this.wavePhase += dt * p.waveSpeed;
        this.sweepPhase += dt * p.sweepSpeed;

        const pulse = p.whiteShift * (0.5 + 0.5 * Math.sin(t * 5.0));
        this.color.setRGB(
            lerp(p.color[0], 1, pulse),
            lerp(p.color[1], 1, pulse),
            lerp(p.color[2], 1, pulse),
        );
        const col = this.color;

        const breath = Math.sin(this.breathPhase) * p.breath;
        root.scale.setScalar(1 + breath + env * 0.015);

        // Core crystal
        const coreI = p.core * (1 + env * 0.35);
        coreGroup.rotation.y += dt * p.rot;
        coreGroup.rotation.x += dt * p.rot * 0.37;
        coreGroup.scale.setScalar(1 + p.expand * Math.sin(t * 9.0));
        facetUniforms.uColor.value.copy(col);
        facetUniforms.uIntensity.value = coreI;
        facetUniforms.uFlash.value = p.flash;
        facetUniforms.uTime.value = t;
        edgeMat.color.copy(col).multiplyScalar(0.9 * coreI);
        inner.rotation.y -= dt * p.rot * 1.6;
        inner.rotation.z += dt * p.rot * 0.8;
        innerEdgeMat.color
            .copy(col)
            .lerp(ACCENT, 0.15)
            .multiplyScalar(0.7 * coreI);
        sparkMat.color
            .setRGB(1, 1, 1)
            .lerp(col, 0.3)
            .multiplyScalar(0.4 * coreI);
        spark.scale.setScalar(0.45 + breath * 3 + env * 0.08);

        // Geodesic lattice
        lattice.rotation.y += dt * p.outerRot;
        lattice.rotation.x = Math.sin(t * 0.11) * 0.2;
        lattice.scale.setScalar(1 + p.expand * 0.5);
        latticeMat.color.copy(col);
        latticeMat.opacity = 0.2 + 0.08 * p.nodes;
        nodeUniforms.uTime.value = t;
        nodeUniforms.uLevel.value = audio.level * (p.barAmp > 0.3 ? 1 : 0.3);
        nodeUniforms.uColor.value.copy(col);
        nodeUniforms.uIntensity.value = p.nodes;

        // HUD plane faces the camera.
        hud.quaternion.copy(this.camera.quaternion);
        hud.scale.setScalar(1 + breath * 0.5);
        hudRings.forEach((ring, i) => {
            ring.mesh.rotation.z += dt * (p.arcSpin[i] ?? 0);
            const u = ring.uniforms;
            if (ring.def.accent) u.uColor.value.copy(ACCENT).multiplyScalar(p.accent);
            else u.uColor.value.copy(col);
            u.uSweepPhase.value = this.sweepPhase * (i % 2 ? -1 : 1);
        });

        // Spectrum
        barUniforms.uTime.value = t;
        barUniforms.uAmp.value = p.barAmp;
        barUniforms.uIdle.value = p.barIdle;
        barUniforms.uWavePhase.value = this.wavePhase;
        for (let i = 0; i < BAND_COUNT; i++) barUniforms.uBands.value[i] = audio.bands[i] ?? 0;
        barUniforms.uColor.value.copy(col);
        barUniforms.uIntensity.value = 0.8;

        this.bloom.strength = 0.6 * p.bloom + env * 0.15;
    }
}
