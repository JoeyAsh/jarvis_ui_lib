/**
 * OrbBase: shared scaffolding for the variant orbs. Renderer, camera, bloom composer, resize,
 * state easing and audio smoothing. Subclasses implement `build(q)` and `update(dt, t, p, audio)`.
 */
import {
    ACESFilmicToneMapping,
    Color,
    Line,
    Mesh,
    PerspectiveCamera,
    Points,
    Scene,
    Sprite,
    Texture,
    Vector2,
    WebGLRenderer,
} from 'three';
import type { Material, Object3D } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createFrameClock } from '../frameClock';
import type { FrameClock } from '../frameClock.types';
import { BAND_COUNT, ORB_VISUAL_STATES } from './constants';
import type {
    OrbBloomParams,
    OrbParamValue,
    OrbPresetShape,
    OrbPresets,
    OrbQualities,
    OrbQualitySettings,
} from './OrbBase.types';
import type {
    OrbAudioFrame,
    OrbQuality,
    OrbRenderer,
    OrbVisualState,
    VariantOrbOptions,
} from './variants.types';

const DEFAULT_BLOOM: OrbBloomParams = [0.8, 0.35, 0.15];

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

function disposeMaterial(material: Material): void {
    if ('map' in material && material.map instanceof Texture) material.map.dispose();
    material.dispose();
}

/** Objects that own a geometry and material(s). `instanceof` alone would yield `any` generics. */
function isRenderable(o: Object3D): o is Mesh | Points | Line | Sprite {
    return o instanceof Mesh || o instanceof Points || o instanceof Line || o instanceof Sprite;
}

function disposeObject(o: Object3D): void {
    if (isRenderable(o)) {
        o.geometry.dispose();
        const material: Material | Material[] = o.material;
        if (Array.isArray(material)) material.forEach(disposeMaterial);
        else disposeMaterial(material);
    }
}

/**
 * Base class of the variant orbs.
 *
 * `build(q)` is called from this constructor, before subclass fields are initialized: it may only
 * use the base members (`scene`, `camera`, `renderer`, `quality`) and must return everything the
 * subclass needs later as `TParts` (available as `this.parts`).
 */
export abstract class OrbBase<
    TPreset extends OrbPresetShape,
    TQuality extends OrbQualitySettings,
    TParts,
> implements OrbRenderer {
    onFrame: ((dt: number) => void) | null = null;
    readonly renderer: WebGLRenderer;
    readonly camera: PerspectiveCamera;

    protected readonly container: HTMLElement;
    protected readonly presets: OrbPresets<TPreset>;
    protected readonly qualities: OrbQualities<TQuality>;
    protected readonly quality: OrbQuality;
    protected readonly scene: Scene;
    protected readonly composer: EffectComposer;
    protected readonly bloom: UnrealBloomPass;
    protected readonly parts: TParts;
    protected state: OrbVisualState = 'idle';
    protected readonly params: TPreset;
    /** Snappy smoothed level (0..1). */
    protected audioLevel = 0;
    /** Snappy smoothed bands (0..1). */
    protected readonly audioBands = new Float32Array(BAND_COUNT);

    private inLevel = 0;
    private readonly inBands = new Float32Array(BAND_COUNT);
    private env = 0;
    private time = 0;
    private readonly resizeObserver: ResizeObserver;
    private readonly clock: FrameClock;

    protected constructor(
        container: HTMLElement,
        options: VariantOrbOptions,
        presets: OrbPresets<TPreset>,
        qualities: OrbQualities<TQuality>,
        bloom: OrbBloomParams = DEFAULT_BLOOM,
    ) {
        this.container = container;
        this.presets = presets;
        this.qualities = qualities;
        this.quality = options.quality === 'low' ? 'low' : 'high';
        const q = qualities[this.quality];

        this.params = structuredClone(presets.idle);

        this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, q.maxPixelRatio));
        this.renderer.toneMapping = ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        container.appendChild(this.renderer.domElement);

        this.scene = new Scene();
        this.scene.background = new Color(0x01040a);
        this.camera = new PerspectiveCamera(35, 1, 0.1, 100);
        this.camera.position.set(0, 0, 6.6);

        this.parts = this.build(q);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const [strength, radius, threshold] = bloom;
        this.bloom = new UnrealBloomPass(new Vector2(256, 256), strength, radius, threshold);
        this.composer.addPass(this.bloom);
        this.composer.addPass(new OutputPass());

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(container);
        this.resize();

        this.clock = createFrameClock();
        this.renderer.setAnimationLoop(this.loop);
    }

    /** Creates the scene content (see the class comment for constraints). */
    protected abstract build(q: TQuality): TParts;

    /** Per-frame animation with eased params `p` and smoothed audio. */
    protected abstract update(dt: number, t: number, p: TPreset, audio: OrbAudioFrame): void;

    setState(state: OrbVisualState): void {
        if (!ORB_VISUAL_STATES.includes(state)) throw new Error(`Unknown orb state: ${state}`);
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
        const s = this.qualities[this.quality].bloomScale;
        this.bloom.resolution.set(w * s, h * s);
        this.camera.aspect = w / h;
        this.camera.position.z = w < h ? 6.6 * Math.min(1.6, h / w) : 6.6;
        this.camera.updateProjectionMatrix();
    }

    private readonly loop = (): void => {
        const dt = Math.min(this.clock.delta(), 0.1);
        this.time += dt;
        const p = this.params;
        const target = this.presets[this.state];

        // Ease all parameters toward the target state.
        const k = 1 - Math.exp(-dt * 3.5);
        const current: OrbPresetShape = p;
        for (const key of Object.keys(target)) {
            const v: OrbParamValue | undefined = target[key];
            const c: OrbParamValue | undefined = current[key];
            if (Array.isArray(v)) {
                if (Array.isArray(c)) {
                    for (let i = 0; i < v.length; i++) c[i] = lerp(c[i] ?? 0, v[i] ?? 0, k);
                }
            } else if (typeof v === 'number' && typeof c === 'number') {
                current[key] = lerp(c, v, k);
            }
        }

        // Audio: snappy level/bands for spectra, calm envelope for glow and scale.
        const att = 1 - Math.exp(-dt * 25);
        const rel = 1 - Math.exp(-dt * 7);
        const lvl = this.inLevel;
        this.audioLevel = lerp(this.audioLevel, lvl, lvl > this.audioLevel ? att : rel);
        for (let i = 0; i < BAND_COUNT; i++) {
            const b = this.inBands[i] ?? 0;
            const cur = this.audioBands[i] ?? 0;
            this.audioBands[i] = lerp(cur, b, b > cur ? att : rel);
        }
        const se = lvl > this.env ? 1 - Math.exp(-dt * 10) : 1 - Math.exp(-dt * 4);
        this.env = lerp(this.env, lvl, se);

        this.update(dt, this.time, p, {
            level: this.audioLevel,
            env: this.env,
            bands: this.audioBands,
        });

        if (this.onFrame) this.onFrame(dt);
        this.composer.render();
    };

    dispose(): void {
        this.renderer.setAnimationLoop(null);
        this.resizeObserver.disconnect();
        this.scene.traverse(disposeObject);
        for (const pass of this.composer.passes) pass.dispose();
        this.composer.dispose();
        this.renderer.dispose();
        this.renderer.domElement.remove();
    }
}
