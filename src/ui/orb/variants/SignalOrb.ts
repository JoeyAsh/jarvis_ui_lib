/**
 * SignalOrb (`signal` variant) – close variation of the particle orb: narrow luminous currents
 * travel across the unchanged particle shell (reacting to audio) and the orbital arcs are clearer.
 */
import type { IUniform } from 'three';
import { ParticleOrb, replaceShader } from './ParticleOrb';
import type {
    ParticleCore,
    ParticleQualitySettings,
    ParticleRing,
    ParticleShell,
} from './ParticleOrb.types';

export class SignalOrb extends ParticleOrb {
    protected override buildCore(q: ParticleQualitySettings): ParticleCore {
        const core = super.buildCore(q);
        core.mesh.scale.setScalar(0.95);
        core.spark.scale.setScalar(0.4);
        return core;
    }

    protected override buildShell(q: ParticleQualitySettings): ParticleShell {
        const shell = super.buildShell(q);
        const material = shell.points.material;
        shell.uniforms.uSize.value = this.quality === 'low' ? 26 : 19;
        material.vertexShader = replaceShader(
            material.vertexShader,
            'gl_PointSize = uSize',
            `// Narrow luminous currents cross the sphere without changing its particle layout.
       float longitude = atan(dir.z, dir.x);
       float phase = longitude * 2.0 + dir.y * 4.5 - uTime * (0.55 + uJitter * 22.0);
       float signal = pow(0.5 + 0.5 * sin(phase), 20.0);
       vBright += signal * (0.22 + uAudioSignal * 0.45) * back;
       gl_PointSize = uSize`,
        );
        // A separate envelope uniform makes the signal respond to both input and speech.
        material.vertexShader = 'uniform float uAudioSignal;\n' + material.vertexShader;
        const audioSignal: IUniform<number> = { value: 0 };
        material.uniforms.uAudioSignal = audioSignal;
        shell.points.onBeforeRender = () => {
            audioSignal.value = this.audioLevel;
        };
        return shell;
    }

    protected override buildRings(): ParticleRing[] {
        const rings = super.buildRings();
        rings.forEach((ring, i) => {
            // Copy definitions so the default orb retains its original ring settings.
            ring.def = { ...ring.def };
            if (i === 0) {
                ring.def.tx = 1.05;
                ring.def.ty = 0.3;
                ring.uniforms.uArc.value = 0.88;
            } else if (i === 1) {
                ring.uniforms.uSegments.value = 96;
                ring.uniforms.uDuty.value = 0.24;
            } else {
                ring.uniforms.uSegments.value = 5;
                ring.uniforms.uDuty.value = 0.8;
                ring.uniforms.uArc.value = 0.9;
                ring.def.opacity = 0.9;
            }
            ring.pivot.rotation.set(ring.def.tx, ring.def.ty, 0);
        });
        return rings;
    }
}
