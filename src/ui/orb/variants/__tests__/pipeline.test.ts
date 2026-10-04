import { afterEach, describe, it, expect, vi } from 'vitest';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { EMISSIVE_ALPHA_SHADER, createOrbPipeline } from '../pipeline';

// jsdom has no WebGL: a minimal renderer stand-in that records how the pipeline configures it.
const { FakeRenderer, rendererInstances } = vi.hoisted(() => {
    const instances: InstanceType<typeof Fake>[] = [];
    class Fake {
        readonly options: unknown;
        readonly domElement = document.createElement('canvas');
        clearAlpha = -1;
        toneMapping = 0;
        toneMappingExposure = 1;

        constructor(options: unknown) {
            this.options = options;
            instances.push(this);
        }

        setClearColor(_color: number, alpha: number): void {
            this.clearAlpha = alpha;
        }

        setPixelRatio(): void {}

        getPixelRatio(): number {
            return 1;
        }

        getSize(target: { set: (x: number, y: number) => unknown }): unknown {
            return target.set(300, 150);
        }
    }
    return { FakeRenderer: Fake, rendererInstances: instances };
});

vi.mock('three', async (importOriginal) => {
    const actual = await importOriginal<typeof import('three')>();
    return { ...actual, WebGLRenderer: FakeRenderer };
});

afterEach(() => {
    rendererInstances.length = 0;
});

describe('createOrbPipeline', () => {
    it('creates a transparent renderer and appends its canvas to the container', () => {
        const container = document.createElement('div');
        createOrbPipeline(container, { maxPixelRatio: 2, bloom: [0.8, 0.35, 0.18] });

        const renderer = rendererInstances[0];
        expect(renderer?.options).toMatchObject({ alpha: true, premultipliedAlpha: true });
        expect(renderer?.clearAlpha).toBe(0);
        expect(container.querySelector('canvas')).toBe(renderer?.domElement);
    });

    it('leaves the scene background empty', () => {
        const { scene } = createOrbPipeline(document.createElement('div'), {
            maxPixelRatio: 1,
            bloom: [1, 0.5, 0.1],
        });
        expect(scene.background).toBeNull();
    });

    it('applies the bloom parameters and ends with the emissive alpha pass', () => {
        const { composer, bloom } = createOrbPipeline(document.createElement('div'), {
            maxPixelRatio: 1,
            bloom: [0.9, 0.4, 0.2],
        });
        expect([bloom.strength, bloom.radius, bloom.threshold]).toEqual([0.9, 0.4, 0.2]);

        const last = composer.passes[composer.passes.length - 1];
        expect(last).toBeInstanceOf(ShaderPass);
        expect(last instanceof ShaderPass && last.material.fragmentShader).toBe(
            EMISSIVE_ALPHA_SHADER.fragmentShader,
        );
    });
});
