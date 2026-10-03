/**
 * HaloOrb (`halo` variant) – close variation of the particle orb: finer outer points, a faint
 * counter-rotating inner shell and softer HUD rings give the original silhouette more depth.
 */
import { Points } from 'three';
import { ParticleOrb, replaceShader } from './ParticleOrb';
import type {
    ParticleCore,
    ParticleQualitySettings,
    ParticleRing,
    ParticleShell,
    ShellUniforms,
} from './ParticleOrb.types';

export class HaloOrb extends ParticleOrb {
    protected override buildCore(q: ParticleQualitySettings): ParticleCore {
        const core = super.buildCore(q);
        core.mesh.scale.setScalar(1.12);
        core.spark.scale.setScalar(0.36);
        return core;
    }

    protected override buildShell(q: ParticleQualitySettings): ParticleShell {
        const shell = super.buildShell({ ...q, particles: Math.round(q.particles * 1.5) });
        const outer = shell.points;
        shell.uniforms.uSize.value = this.quality === 'low' ? 20 : 14;
        outer.material.vertexShader = replaceShader(
            outer.material.vertexShader,
            'vBright = (0.25 + 0.75 * rim)',
            'vBright = (0.32 + 0.68 * rim)',
        );
        // Reuse the geometry; shared time/audio uniforms keep both shells synchronized.
        const material = outer.material.clone();
        const innerUniforms: ShellUniforms = {
            ...shell.uniforms,
            uRadius: { value: 0.84 },
            uSize: { value: this.quality === 'low' ? 16 : 11 },
            uIntensity: { value: 0.2 },
        };
        material.uniforms = innerUniforms;
        const inner = new Points(outer.geometry, material);
        inner.rotation.set(0.28, 0.45, 0.12);
        inner.onBeforeRender = () => {
            innerUniforms.uIntensity.value = shell.uniforms.uIntensity.value * 0.32;
            inner.rotation.y = -outer.rotation.y * 0.65 + 0.45;
        };
        this.root.add(inner);
        return shell;
    }

    protected override buildRings(): ParticleRing[] {
        const rings = super.buildRings();
        rings.forEach((ring, i) => {
            ring.def = { ...ring.def, opacity: ring.def.opacity * 0.8 };
            if (i === 1) {
                ring.uniforms.uSegments.value = 160;
                ring.uniforms.uDuty.value = 0.12;
            }
        });
        return rings;
    }
}
