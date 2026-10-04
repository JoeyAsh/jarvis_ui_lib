/**
 * ParticleOrb (`particle` variant) – organic holographic orb: glowing Fresnel core with glow
 * sprites, a particle data shell on a Fibonacci sphere (16-band circular spectrum), three tilted
 * additive HUD rings and camera-facing shockwaves while speaking. Bloom + ACES tone mapping.
 *
 * Designed as a base class: `HaloOrb` and `SignalOrb` override the protected `buildCore`,
 * `buildShell` and `buildRings` hooks.
 */
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    CanvasTexture,
    Color,
    DoubleSide,
    Group,
    IcosahedronGeometry,
    Line,
    Material,
    Mesh,
    Points,
    RingGeometry,
    ShaderMaterial,
    Sprite,
    SpriteMaterial,
    SRGBColorSpace,
    Texture,
    Vector4,
} from 'three';
import type { Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { createFrameClock } from '../frameClock';
import type { FrameClock } from '../frameClock.types';
import { BAND_COUNT, ORB_VISUAL_STATES } from './constants';
import { NOISE_GLSL } from './glsl';
import { createOrbPipeline } from './pipeline';
import type {
    CoreUniforms,
    ParticleCore,
    ParticlePreset,
    ParticleQualitySettings,
    ParticleRing,
    ParticleScalarKey,
    ParticleShell,
    ParticleShock,
    RingDef,
    RingUniforms,
    ShellUniforms,
    SphereAttributes,
} from './ParticleOrb.types';
import type { OrbQuality, OrbRenderer, OrbVisualState, VariantOrbOptions } from './variants.types';

// Target parameters per state; the orb eases between them.
const PRESETS: Readonly<Record<OrbVisualState, ParticlePreset>> = {
    idle: {
        color: [0.0, 0.8, 1.0],
        core: 1.0,
        breath: 0.035,
        breathSpeed: 1.5,
        noiseAmp: 0.035,
        noiseSpeed: 0.12,
        jitter: 0.0,
        bandAmp: 0.0,
        speak: 0.0,
        flicker: 0.0,
        whiteShift: 0.0,
        spin: [0.3, -0.22, 0.16],
        tumble: 0.05,
        tumbleSpeed: 0.3,
        shellSpin: 0.08,
        bloom: 1.0,
    },
    listening: {
        color: [0.1, 0.95, 1.0],
        core: 1.2,
        breath: 0.012,
        breathSpeed: 1.0,
        noiseAmp: 0.03,
        noiseSpeed: 0.2,
        jitter: 0.0,
        bandAmp: 0.55,
        speak: 0.0,
        flicker: 0.0,
        whiteShift: 0.0,
        spin: [0.45, -0.35, 0.25],
        tumble: 0.08,
        tumbleSpeed: 0.5,
        shellSpin: 0.12,
        bloom: 1.2,
    },
    working: {
        color: [0.3, 0.55, 1.0],
        core: 1.35,
        breath: 0.01,
        breathSpeed: 4.0,
        noiseAmp: 0.06,
        noiseSpeed: 0.7,
        jitter: 0.03,
        bandAmp: 0.0,
        speak: 0.0,
        flicker: 0.35,
        whiteShift: 0.6,
        spin: [2.6, -3.4, 1.9],
        tumble: 0.7,
        tumbleSpeed: 1.6,
        shellSpin: 0.5,
        bloom: 1.35,
    },
    speaking: {
        color: [0.2, 0.85, 1.0],
        core: 1.15,
        breath: 0.01,
        breathSpeed: 1.5,
        noiseAmp: 0.03,
        noiseSpeed: 0.2,
        jitter: 0.0,
        bandAmp: 0.05,
        speak: 1.0,
        flicker: 0.0,
        whiteShift: 0.0,
        spin: [0.6, -0.45, 0.35],
        tumble: 0.1,
        tumbleSpeed: 0.5,
        shellSpin: 0.15,
        bloom: 1.1,
    },
};

/** Every single-number preset key (eased one by one each frame). */
const SCALAR_KEYS: readonly ParticleScalarKey[] = [
    'core',
    'breath',
    'breathSpeed',
    'noiseAmp',
    'noiseSpeed',
    'jitter',
    'bandAmp',
    'speak',
    'flicker',
    'whiteShift',
    'tumble',
    'tumbleSpeed',
    'shellSpin',
    'bloom',
];

const QUALITY: Readonly<Record<OrbQuality, ParticleQualitySettings>> = {
    high: { particles: 4000, maxPixelRatio: 2, bloomScale: 1.0, coreDetail: 48 },
    low: { particles: 1500, maxPixelRatio: 1, bloomScale: 0.5, coreDetail: 16 },
};

const MAX_SHOCKS = 4;

// ---------- Core: Fresnel hologram shell ----------

const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uNoiseTime;
uniform float uNoiseAmp;
uniform float uAudio;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec3 vObjPos;
${NOISE_GLSL}
void main(){
  vec3 pos = position;
  float n = snoise(position * 2.5 + uNoiseTime);
  float wave = sin(position.y * 10.0 + uTime * 3.0) * uAudio * 0.15;
  pos += normal * (n * uNoiseAmp * 1.5 + wave);
  vObjPos = pos;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = mv.xyz;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec3 vObjPos;
void main(){
  vec3 viewDir = normalize(-vViewPos);
  float fresnel = pow(clamp(1.0 - dot(viewDir, normalize(vNormalV)), 0.0, 1.0), 2.5);
  float scan = sin(vObjPos.y * 80.0 - uTime * 4.0) * 0.12 + 0.88;
  vec3 col = uColor * (fresnel * 1.1 + 0.05) * scan * uIntensity;
  gl_FragColor = vec4(col, clamp(fresnel * 0.9 + 0.08, 0.0, 1.0));
}
`;

// ---------- Particle data shell ----------

const SHELL_VERT = /* glsl */ `
uniform float uTime;
uniform float uNoiseTime;
uniform float uRadius;
uniform float uNoiseAmp;
uniform float uJitter;
uniform float uBandAmp;
uniform float uBands[${String(BAND_COUNT)}];
uniform vec4 uShockR;
uniform vec4 uShockA;
uniform float uSize;
uniform float uPixelRatio;
attribute float aRandom;
attribute float aBand;
varying float vBright;
${NOISE_GLSL}
void main(){
  vec3 dir = normalize(position);
  float r = uRadius;
  r += snoise(dir * 1.8 + uNoiseTime) * uNoiseAmp;
  r += snoise(dir * 9.0 + uTime * 7.0 + aRandom * 10.0) * uJitter;

  // Frequency bands wrap around the sphere like a circular spectrum.
  float f = aBand * float(${String(BAND_COUNT - 1)});
  int i0 = int(floor(f));
  int i1 = min(i0 + 1, ${String(BAND_COUNT - 1)});
  float band = mix(uBands[i0], uBands[i1], fract(f));
  float equator = 0.35 + 0.65 * (1.0 - abs(dir.y));
  r += band * uBandAmp * equator * (0.55 + 0.45 * aRandom);

  // Shockwaves: screen-space rings travelling outward bump the particles they pass.
  vec4 center = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 probe = modelViewMatrix * vec4(dir * uRadius, 1.0);
  float d = length(probe.xy - center.xy);
  float hit = 0.0;
  for (int k = 0; k < 4; k++) {
    float x = (d - uShockR[k]) * 9.0;
    hit += exp(-x * x) * uShockA[k];
  }
  r += hit * 0.03;

  vec4 mv = modelViewMatrix * vec4(dir * r, 1.0);
  gl_Position = projectionMatrix * mv;

  vec3 nv = normalize(normalMatrix * dir);
  float rim = 1.0 - abs(nv.z);
  float back = nv.z < 0.0 ? 0.45 : 1.0;
  vBright = (0.25 + 0.75 * rim) * back * (0.6 + 0.4 * aRandom) + hit * 0.6 + band * uBandAmp * 1.2;
  gl_PointSize = uSize * (0.5 + aRandom) * uPixelRatio * (1.0 + hit) / -mv.z;
}
`;

const SHELL_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying float vBright;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(uColor * vBright * uIntensity, a);
}
`;

// ---------- HUD rings and shockwaves ----------

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
uniform float uArc;
uniform float uSweepPhase;
varying float vAngle;
varying float vRadial;
void main(){
  float a = vAngle / 6.2831853 + 0.5;
  float on = uSegments > 0.5 ? step(fract(a * uSegments), uDuty) : 1.0;
  float arc = step(a, uArc);
  float sweep = pow(fract(a - uSweepPhase), 10.0);
  float edge = smoothstep(0.0, 0.5, 1.0 - abs(vRadial * 2.0 - 1.0));
  float alpha = on * arc * edge * uOpacity;
  gl_FragColor = vec4(uColor * (0.55 + 2.2 * sweep), alpha);
}
`;

const RING_DEFS: readonly RingDef[] = [
    // radius, width, segments (0 = solid), duty, arc, base tilt x/y, sweep speed
    { r: 1.24, w: 0.012, seg: 0, duty: 1, arc: 1.0, tx: 1.25, ty: 0.15, sweep: 0.12, opacity: 0.9 },
    {
        r: 1.36,
        w: 0.05,
        seg: 120,
        duty: 0.18,
        arc: 1.0,
        tx: 1.75,
        ty: -0.45,
        sweep: -0.08,
        opacity: 0.55,
    },
    {
        r: 1.52,
        w: 0.014,
        seg: 7,
        duty: 0.72,
        arc: 1.0,
        tx: 0.95,
        ty: 0.7,
        sweep: 0.05,
        opacity: 0.75,
    },
];

/**
 * Soft radial glow (256×256, own stops) for the core sprites. The shared `makeGlowTexture` in
 * `glowTexture.ts` is 128×128 with different stops, so it would change the look.
 */
function makeCoreGlowTexture(): CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        g.addColorStop(0.0, 'rgba(255,255,255,1)');
        g.addColorStop(0.15, 'rgba(255,255,255,0.75)');
        g.addColorStop(0.4, 'rgba(255,255,255,0.18)');
        g.addColorStop(1.0, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
    }
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
}

/** Fibonacci sphere: evenly spread points on the unit sphere. */
function fibonacciSphere(count: number): SphereAttributes {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const bands = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const rad = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const x = Math.cos(theta) * rad;
        const z = Math.sin(theta) * rad;
        positions.set([x, y, z], i * 3);
        randoms[i] = Math.random();
        // Longitude mirrored to 0..1 so the spectrum is symmetric around the sphere.
        const lon = Math.atan2(z, x) / Math.PI; // -1..1
        bands[i] = Math.abs(lon);
    }
    return { positions, randoms, bands };
}

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Replaces `anchor` in a shader source; throws when the anchor is missing so shader patches in
 * subclasses fail loudly instead of silently doing nothing.
 */
export function replaceShader(source: string, anchor: string, replacement: string): string {
    if (!source.includes(anchor)) throw new Error('Particle shader anchor missing');
    return source.replace(anchor, replacement);
}

function disposeObject(object: Object3D): void {
    if (!(
        object instanceof Mesh ||
        object instanceof Points ||
        object instanceof Line ||
        object instanceof Sprite
    )) {
        return;
    }
    const geometry: unknown = object.geometry;
    if (geometry instanceof BufferGeometry) geometry.dispose();
    const material: unknown = object.material;
    const materials: unknown[] = Array.isArray(material) ? material : [material];
    for (const m of materials) {
        if (!(m instanceof Material)) continue;
        const map: unknown = 'map' in m ? m.map : null;
        if (map instanceof Texture) map.dispose();
        m.dispose();
    }
}

export class ParticleOrb implements OrbRenderer {
    readonly camera: PerspectiveCamera;
    readonly renderer: WebGLRenderer;
    onFrame: ((dt: number) => void) | null = null;

    protected readonly container: HTMLElement;
    protected readonly quality: OrbQuality;
    protected readonly scene: Scene;
    protected readonly root: Group;
    protected readonly core: ParticleCore;
    protected readonly shell: ParticleShell;
    protected readonly rings: ParticleRing[];
    protected readonly shocks: ParticleShock[];
    protected readonly composer: EffectComposer;
    protected readonly bloom: UnrealBloomPass;

    protected state: OrbVisualState = 'idle';
    protected readonly params: ParticlePreset = structuredClone(PRESETS.idle);
    /** Smoothed audio level (fast attack, slower release). */
    protected audioLevel = 0;
    /** Smoothed audio bands. */
    protected readonly audioBands = new Float32Array(BAND_COUNT);

    private inLevel = 0;
    private readonly inBands = new Float32Array(BAND_COUNT);
    private time = 0;
    private noiseTime = 0;
    private breathPhase = 0;
    private tumblePhase = 0;
    private sweepPhase = 0;
    private flicker = 1;
    private shockCooldown = 0;
    private prevLevel = 0;
    private speakEnv = 0;
    private readonly color = new Color();
    private readonly resizeObserver: ResizeObserver;
    private readonly clock: FrameClock;

    constructor(container: HTMLElement, options: VariantOrbOptions = {}) {
        this.container = container;
        this.quality = options.quality === 'low' ? 'low' : 'high';
        const q = QUALITY[this.quality];

        // Renderer, scene, camera and post-processing (transparent canvas, see pipeline.ts).
        const pipeline = createOrbPipeline(container, {
            maxPixelRatio: q.maxPixelRatio,
            bloom: [0.8, 0.35, 0.18],
        });
        this.renderer = pipeline.renderer;
        this.scene = pipeline.scene;
        this.camera = pipeline.camera;
        this.composer = pipeline.composer;
        this.bloom = pipeline.bloom;

        this.root = new Group();
        this.scene.add(this.root);

        this.core = this.buildCore(q);
        this.shell = this.buildShell(q);
        this.rings = this.buildRings();
        this.shocks = this.buildShocks();

        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        this.resizeObserver.observe(container);
        this.resize();

        this.clock = createFrameClock();
        this.renderer.setAnimationLoop(this.loop);
    }

    /** Builds the Fresnel core mesh and its glow/spark sprites (added to `root`). */
    protected buildCore(q: ParticleQualitySettings): ParticleCore {
        const uniforms: CoreUniforms = {
            uTime: { value: 0 },
            uNoiseTime: { value: 0 },
            uNoiseAmp: { value: 0.03 },
            uAudio: { value: 0 },
            uColor: { value: new Color() },
            uIntensity: { value: 1 },
        };
        const coreMat = new ShaderMaterial({
            uniforms,
            vertexShader: CORE_VERT,
            fragmentShader: CORE_FRAG,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        const mesh = new Mesh(new IcosahedronGeometry(0.42, q.coreDetail), coreMat);
        this.root.add(mesh);

        const glowMat = new SpriteMaterial({
            map: makeCoreGlowTexture(),
            blending: AdditiveBlending,
            depthWrite: false,
            transparent: true,
        });
        const glow = new Sprite(glowMat);
        glow.scale.setScalar(1.5);
        this.root.add(glow);

        // Small white-hot center point.
        const sparkMat = glowMat.clone();
        const spark = new Sprite(sparkMat);
        spark.scale.setScalar(0.45);
        this.root.add(spark);

        return { mesh, uniforms, glow, glowMat, spark, sparkMat };
    }

    /** Builds the particle data shell (added to `root`). */
    protected buildShell(q: ParticleQualitySettings): ParticleShell {
        const { positions, randoms, bands } = fibonacciSphere(q.particles);
        const geo = new BufferGeometry();
        geo.setAttribute('position', new BufferAttribute(positions, 3));
        geo.setAttribute('aRandom', new BufferAttribute(randoms, 1));
        geo.setAttribute('aBand', new BufferAttribute(bands, 1));

        const uniforms: ShellUniforms = {
            uTime: { value: 0 },
            uNoiseTime: { value: 0 },
            uRadius: { value: 1 },
            uNoiseAmp: { value: 0.03 },
            uJitter: { value: 0 },
            uBandAmp: { value: 0 },
            uBands: { value: new Array<number>(BAND_COUNT).fill(0) },
            uShockR: { value: new Vector4(-9, -9, -9, -9) },
            uShockA: { value: new Vector4() },
            uSize: { value: q.particles > 2000 ? 20 : 28 },
            uPixelRatio: { value: this.renderer.getPixelRatio() },
            uColor: { value: new Color() },
            uIntensity: { value: 1 },
        };
        const mat = new ShaderMaterial({
            uniforms,
            vertexShader: SHELL_VERT,
            fragmentShader: SHELL_FRAG,
            transparent: true,
            depthWrite: false,
            blending: AdditiveBlending,
        });
        const points = new Points(geo, mat);
        this.root.add(points);
        return { points, uniforms };
    }

    /** Builds the tilted HUD rings (each in a pivot group added to `root`). */
    protected buildRings(): ParticleRing[] {
        return RING_DEFS.map((def) => {
            const inner = def.r - def.w / 2;
            const outer = def.r + def.w / 2;
            const uniforms: RingUniforms = {
                uInner: { value: inner },
                uOuter: { value: outer },
                uColor: { value: new Color() },
                uOpacity: { value: def.opacity },
                uSegments: { value: def.seg },
                uDuty: { value: def.duty },
                uArc: { value: def.arc },
                uSweepPhase: { value: 0 },
            };
            const mat = new ShaderMaterial({
                uniforms,
                vertexShader: RING_VERT,
                fragmentShader: RING_FRAG,
                transparent: true,
                depthWrite: false,
                side: DoubleSide,
                blending: AdditiveBlending,
            });
            const mesh = new Mesh(new RingGeometry(inner, outer, 256, 1), mat);
            const pivot = new Group();
            pivot.rotation.set(def.tx, def.ty, 0);
            pivot.add(mesh);
            this.root.add(pivot);
            return { def, mesh, pivot, uniforms };
        });
    }

    /** Camera-facing rings that expand from the core while speaking (added to the scene). */
    private buildShocks(): ParticleShock[] {
        const pool: ParticleShock[] = [];
        for (let i = 0; i < MAX_SHOCKS; i++) {
            const uniforms: RingUniforms = {
                uInner: { value: 0.988 },
                uOuter: { value: 1.0 },
                uColor: { value: new Color() },
                uOpacity: { value: 0 },
                uSegments: { value: 0 },
                uDuty: { value: 1 },
                uArc: { value: 1 },
                uSweepPhase: { value: 0 },
            };
            const mat = new ShaderMaterial({
                uniforms,
                vertexShader: RING_VERT,
                fragmentShader: RING_FRAG,
                transparent: true,
                depthWrite: false,
                side: DoubleSide,
                blending: AdditiveBlending,
            });
            const mesh = new Mesh(new RingGeometry(0.988, 1.0, 192, 1), mat);
            mesh.visible = false;
            this.scene.add(mesh);
            pool.push({ mesh, uniforms, age: 0, life: 1.3, strength: 0, active: false });
        }
        return pool;
    }

    setState(state: OrbVisualState): void {
        if (!ORB_VISUAL_STATES.includes(state)) {
            throw new Error(`Unknown orb state: ${String(state)}`);
        }
        this.state = state;
    }

    /** Feed audio: level 0..1, bands = up to 16 values 0..1 (low → high frequencies). */
    setAudio(level: number, bands?: ArrayLike<number>): void {
        this.inLevel = Math.max(0, Math.min(1, level || 0));
        if (bands) {
            for (let i = 0; i < BAND_COUNT; i++) {
                this.inBands[i] = Math.max(0, Math.min(1, bands[i] || 0));
            }
        } else {
            this.inBands.fill(this.inLevel);
        }
    }

    resize(): void {
        const w = Math.max(1, this.container.clientWidth);
        const h = Math.max(1, this.container.clientHeight);
        this.renderer.setSize(w, h);
        this.composer.setSize(w, h);
        const s = QUALITY[this.quality].bloomScale;
        this.bloom.resolution.set(w * s, h * s);
        this.camera.aspect = w / h;
        // Keep the whole orb visible in portrait layouts.
        this.camera.position.z = w < h ? 6.6 * Math.min(1.6, h / w) : 6.6;
        this.camera.updateProjectionMatrix();
    }

    private spawnShock(strength: number): void {
        const s =
            this.shocks.find((x) => !x.active) ??
            this.shocks.reduce((a, b) => (a.age > b.age ? a : b));
        s.active = true;
        s.age = 0;
        s.strength = strength;
        s.mesh.visible = true;
    }

    private readonly loop = (): void => {
        const dt = Math.min(this.clock.delta(), 0.1);
        this.time += dt;
        const t = this.time;
        const p = this.params;
        const target = PRESETS[this.state];

        // Ease all parameters toward the target state.
        const k = 1 - Math.exp(-dt * 3.5);
        for (const key of SCALAR_KEYS) p[key] = lerp(p[key], target[key], k);
        for (let i = 0; i < p.color.length; i++) p.color[i] = lerp(p.color[i], target.color[i], k);
        for (let i = 0; i < p.spin.length; i++) p.spin[i] = lerp(p.spin[i], target.spin[i], k);

        // Audio smoothing: fast attack, slower release.
        const att = 1 - Math.exp(-dt * 30);
        const rel = 1 - Math.exp(-dt * 8);
        const lvl = this.inLevel;
        this.audioLevel = lerp(this.audioLevel, lvl, lvl > this.audioLevel ? att : rel);
        for (let i = 0; i < BAND_COUNT; i++) {
            const b = this.inBands[i];
            this.audioBands[i] = lerp(this.audioBands[i], b, b > this.audioBands[i] ? att : rel);
        }
        const audio = this.audioLevel;

        this.noiseTime += dt * p.noiseSpeed;
        this.breathPhase += dt * p.breathSpeed;
        this.tumblePhase += dt * p.tumbleSpeed;
        this.sweepPhase += dt;

        // Color: working pulses between blue and intense white.
        const pulse = p.whiteShift * (0.5 + 0.5 * Math.sin(t * 6.0));
        this.color.setRGB(
            lerp(p.color[0], 1, pulse),
            lerp(p.color[1], 1, pulse),
            lerp(p.color[2], 1, pulse),
        );

        // Flicker for working (smoothed random).
        const flickTarget = 1 - p.flicker * Math.random();
        this.flicker = lerp(this.flicker, flickTarget, 0.35);

        const listenAudio = audio * (p.bandAmp > 0.3 ? 1 : 0.3);
        const se = audio > this.speakEnv ? 1 - Math.exp(-dt * 10) : 1 - Math.exp(-dt * 4);
        this.speakEnv = lerp(this.speakEnv, audio, se);
        const speakAudio = this.speakEnv * p.speak;
        const breath = Math.sin(this.breathPhase) * p.breath;
        const scale = 1 + breath + speakAudio * 0.02 + listenAudio * 0.05;
        this.root.scale.setScalar(scale);

        // Speaking shockwaves on rising amplitude.
        this.shockCooldown -= dt;
        if (
            p.speak > 0.5 &&
            audio > 0.45 &&
            audio - this.prevLevel > 0.015 &&
            this.shockCooldown <= 0
        ) {
            this.spawnShock(Math.min(1, audio * 1.4));
            this.shockCooldown = 0.5;
        }
        this.prevLevel = audio;

        const su = this.shell.uniforms;
        const rArr: [number, number, number, number] = [-9, -9, -9, -9];
        const aArr: [number, number, number, number] = [0, 0, 0, 0];
        this.shocks.forEach((s, i) => {
            if (!s.active) return;
            s.age += dt;
            const u = s.age / s.life;
            if (u >= 1) {
                s.active = false;
                s.mesh.visible = false;
                return;
            }
            const ease = 1 - Math.pow(1 - u, 2.2);
            const radius = 0.35 + ease * 1.75;
            s.mesh.scale.setScalar(radius * scale);
            s.mesh.quaternion.copy(this.camera.quaternion);
            s.uniforms.uOpacity.value = (1 - u) * (1 - u) * s.strength * 0.35;
            s.uniforms.uColor.value.copy(this.color);
            rArr[i] = radius;
            aArr[i] = (1 - u) * s.strength;
        });
        su.uShockR.value.set(rArr[0], rArr[1], rArr[2], rArr[3]);
        su.uShockA.value.set(aArr[0], aArr[1], aArr[2], aArr[3]);

        // Core
        const c = this.core;
        const coreI = p.core * this.flicker * (1 + speakAudio * 0.4 + listenAudio * 0.6);
        c.uniforms.uTime.value = t;
        c.uniforms.uNoiseTime.value = this.noiseTime;
        c.uniforms.uNoiseAmp.value = p.noiseAmp;
        c.uniforms.uAudio.value = audio * Math.max(p.bandAmp, p.speak * 0.08);
        c.uniforms.uColor.value.copy(this.color);
        c.uniforms.uIntensity.value = coreI;
        c.glowMat.color.copy(this.color).multiplyScalar(0.3 * coreI);
        c.glow.scale.setScalar(1.1 + breath * 4 + speakAudio * 0.12);
        c.sparkMat.color
            .setRGB(1, 1, 1)
            .lerp(this.color, 0.25)
            .multiplyScalar(0.7 * coreI);
        c.mesh.rotation.y += dt * 0.2;

        // Shell
        su.uTime.value = t;
        su.uNoiseTime.value = this.noiseTime;
        su.uNoiseAmp.value = p.noiseAmp;
        su.uJitter.value = p.jitter;
        su.uBandAmp.value = p.bandAmp;
        for (let i = 0; i < BAND_COUNT; i++) su.uBands.value[i] = this.audioBands[i];
        su.uColor.value.copy(this.color);
        su.uIntensity.value = 0.5 + listenAudio * 0.45 + speakAudio * 0.12;
        this.shell.points.rotation.y += dt * p.shellSpin;
        this.shell.points.rotation.x = Math.sin(t * 0.13) * 0.15;

        // HUD rings
        this.rings.forEach((ring, i) => {
            ring.mesh.rotation.z += dt * p.spin[i];
            const ph = this.tumblePhase + i * 2.1;
            ring.pivot.rotation.x = ring.def.tx + Math.sin(ph) * p.tumble;
            ring.pivot.rotation.y = ring.def.ty + Math.cos(ph * 1.3) * p.tumble;
            ring.uniforms.uColor.value.copy(this.color);
            ring.uniforms.uSweepPhase.value = this.sweepPhase * ring.def.sweep * (1 + p.tumble * 6);
            ring.uniforms.uOpacity.value =
                ring.def.opacity * (0.85 + 0.15 * this.flicker + speakAudio * 0.15);
        });

        this.bloom.strength =
            0.6 * p.bloom * (0.85 + 0.15 * this.flicker) + speakAudio * 0.2 + listenAudio * 0.25;

        if (this.onFrame) this.onFrame(dt);
        this.composer.render();
    };

    dispose(): void {
        this.renderer.setAnimationLoop(null);
        this.resizeObserver.disconnect();
        this.scene.traverse(disposeObject);
        this.composer.dispose();
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
