/**
 * Shared WebGL pipeline of the variant orbs: a transparent renderer, an empty scene (no
 * background), the camera and the bloom post-processing chain.
 *
 * The orbs are purely emissive (all materials blend additively), so the final `EmissiveAlphaPass`
 * derives the canvas alpha from the brightest color channel. The result is valid premultiplied
 * alpha: dark pixels are fully transparent and whatever lies behind the canvas (e.g. the HUDShell
 * scene) stays visible, while the orb and its bloom glow on top of it.
 */
import { ACESFilmicToneMapping, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { OrbPipeline, OrbPipelineOptions } from './pipeline.types';

/**
 * Final pass: keeps the (tone-mapped, sRGB-encoded) color and sets alpha to its brightest
 * channel, so `rgb <= alpha` holds and the canvas composites correctly over the page.
 */
export const EMISSIVE_ALPHA_SHADER = {
    name: 'EmissiveAlphaShader',
    uniforms: { tDiffuse: { value: null } },
    vertexShader: /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
    fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(){
  vec3 rgb = clamp(texture2D(tDiffuse, vUv).rgb, 0.0, 1.0);
  float alpha = max(rgb.r, max(rgb.g, rgb.b));
  gl_FragColor = vec4(rgb, alpha);
}
`,
};

/** Creates renderer (appended to `container`), scene, camera and the bloom composer. */
export function createOrbPipeline(
    container: HTMLElement,
    options: OrbPipelineOptions,
): OrbPipeline {
    const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
        powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, options.maxPixelRatio));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // No `scene.background`: the canvas must stay transparent around the orb.
    const scene = new Scene();
    const camera = new PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    // EffectComposer render targets are RGBA HalfFloat by default, so alpha survives every pass.
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const [strength, radius, threshold] = options.bloom;
    const bloom = new UnrealBloomPass(new Vector2(256, 256), strength, radius, threshold);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.addPass(new ShaderPass(EMISSIVE_ALPHA_SHADER));

    return { renderer, scene, camera, composer, bloom };
}
