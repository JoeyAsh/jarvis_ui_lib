/**
 * ReactorOrb: mechanical energy core. Hologram core sphere, counter-rotating segmented cyan
 * rotors with an amber telemetry ring, and a 64-vane audio iris.
 */
import {
    AdditiveBlending,
    BoxGeometry,
    DoubleSide,
    Group,
    Mesh,
    MeshBasicMaterial,
    RingGeometry,
    ShaderMaterial,
    SphereGeometry,
    Sprite,
    SpriteMaterial,
} from 'three';
import { makeGlowTexture } from './glowTexture';
import { OrbBase } from './OrbBase';
import type { OrbPresets, OrbQualities } from './OrbBase.types';
import type {
    ReactorCoreUniforms,
    ReactorParts,
    ReactorPreset,
    ReactorQuality,
    ReactorRotor,
} from './ReactorOrb.types';
import type { OrbAudioFrame, VariantOrbOptions } from './variants.types';

const PRESETS: OrbPresets<ReactorPreset> = {
    idle: { speed: 0.16, gain: 0.8, audio: 0, work: 0, breath: 0.018 },
    listening: { speed: 0.24, gain: 1, audio: 1, work: 0, breath: 0.008 },
    working: { speed: 1.15, gain: 1.2, audio: 0, work: 1, breath: 0.006 },
    speaking: { speed: 0.2, gain: 0.95, audio: 0.7, work: 0, breath: 0.012 },
};

const QUALITY: OrbQualities<ReactorQuality> = {
    high: { maxPixelRatio: 2, bloomScale: 1, segments: 160 },
    low: { maxPixelRatio: 1, bloomScale: 0.5, segments: 80 },
};

const ROTOR_COUNTS = [9, 12, 24, 3] as const;

const additive = {
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
} as const;

export class ReactorOrb extends OrbBase<ReactorPreset, ReactorQuality, ReactorParts> {
    private phase = 0;

    constructor(container: HTMLElement, options: VariantOrbOptions = {}) {
        super(container, options, PRESETS, QUALITY, [0.75, 0.4, 0.18]);
    }

    protected build(q: ReactorQuality): ReactorParts {
        const root = new Group();
        this.scene.add(root);
        const rotors: ReactorRotor[] = [];
        // Curved rotor plates leave generous negative space between luminous tracks.
        for (let layer = 0; layer < 4; layer++) {
            const pivot = new Group();
            pivot.rotation.set(
                layer === 3 ? 0.95 : 0.12 * layer,
                layer === 3 ? 0.4 : -0.1 * layer,
                0,
            );
            const rotor = new Group();
            const radius = 0.55 + layer * 0.24;
            const count = ROTOR_COUNTS[layer] ?? 1;
            const material = new MeshBasicMaterial({
                ...additive,
                color: layer === 2 ? 0xffb45c : 0x54ddff,
                opacity: layer === 2 ? 0.55 : 0.8,
            });
            const geometry = new RingGeometry(
                radius,
                radius + (layer === 0 ? 0.095 : 0.025),
                Math.max(8, Math.floor(q.segments / count)),
                1,
                0,
                ((Math.PI * 2) / count) * 0.72,
            );
            for (let i = 0; i < count; i++) {
                const plate = new Mesh(geometry, material);
                plate.rotation.z = (i / count) * Math.PI * 2;
                rotor.add(plate);
            }
            pivot.add(rotor);
            root.add(pivot);
            rotors.push({ pivot, rotor, material });
        }

        const coreUniforms: ReactorCoreUniforms = {
            uTime: { value: 0 },
            uGain: { value: 1 },
            uWork: { value: 0 },
        };
        const coreMaterial = new ShaderMaterial({
            ...additive,
            uniforms: coreUniforms,
            vertexShader: `varying vec3 vNormal; varying vec3 vView;
        void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);
        vNormal=normalize(normalMatrix*normal);vView=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
            fragmentShader: `uniform float uTime;uniform float uGain;uniform float uWork;
        varying vec3 vNormal;varying vec3 vView;
        void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),2.0);
        float scan=0.85+0.15*sin(vNormal.y*65.0-uTime*3.0);
        vec3 color=mix(vec3(0.12,0.75,1.0),vec3(0.7,0.9,1.0),uWork);
        gl_FragColor=vec4(color*(0.18+rim*1.8)*scan*uGain,0.65);}`,
        });
        const core = new Mesh(
            new SphereGeometry(0.43, q.segments / 4, q.segments / 8),
            coreMaterial,
        );
        root.add(core);

        const iris: Mesh<BoxGeometry, MeshBasicMaterial>[] = [];
        const vaneGeometry = new BoxGeometry(0.018, 0.16, 0.018);
        for (let i = 0; i < 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            const material = new MeshBasicMaterial({ ...additive, color: 0x74ecff, opacity: 0.65 });
            const vane = new Mesh(vaneGeometry, material);
            vane.position.set(Math.cos(angle) * 0.99, Math.sin(angle) * 0.99, 0.05);
            vane.rotation.z = angle - Math.PI / 2;
            root.add(vane);
            iris.push(vane);
        }

        const glowMaterial = new SpriteMaterial({
            ...additive,
            map: makeGlowTexture(),
            color: 0x36caff,
            opacity: 0.55,
        });
        const glow = new Sprite(glowMaterial);
        glow.scale.setScalar(1.5);
        root.add(glow);

        return { root, rotors, coreUniforms, iris, glowMaterial };
    }

    protected update(dt: number, t: number, p: ReactorPreset, audio: OrbAudioFrame): void {
        const { root, rotors, coreUniforms, iris, glowMaterial } = this.parts;
        this.phase += dt * p.speed;
        const energy = audio.env * p.audio;
        root.scale.setScalar(1 + Math.sin(t * 1.3) * p.breath + energy * 0.035);
        rotors.forEach(({ pivot, rotor, material }, i) => {
            rotor.rotation.z += dt * p.speed * (i % 2 ? -1 : 1) * (0.7 + i * 0.3);
            if (i === 3) pivot.rotation.y = 0.4 + Math.sin(this.phase * 0.7) * 0.25;
            material.opacity = (i === 2 ? 0.45 : 0.65) + energy * 0.2 + p.work * 0.12;
        });
        iris.forEach((vane, i) => {
            const band =
                audio.bands[
                    Math.min(15, Math.floor(Math.abs(Math.sin((i / 64) * Math.PI * 2)) * 16))
                ] ?? 0;
            const sweep = Math.pow(
                0.5 + 0.5 * Math.cos((i / 64) * Math.PI * 2 - this.phase * 4),
                12,
            );
            vane.scale.y = 0.35 + band * p.audio * 2.2 + sweep * p.work * 1.2;
            vane.material.opacity = 0.35 + band * p.audio * 0.5 + sweep * 0.3;
        });
        coreUniforms.uTime.value = t;
        coreUniforms.uGain.value = p.gain + energy * 0.7;
        coreUniforms.uWork.value = p.work;
        glowMaterial.opacity = 0.4 * p.gain + energy * 0.2;
        this.bloom.strength = 0.65 + energy * 0.25 + p.work * 0.12;
    }
}
