import type { OrbRenderer, OrbVariant, VariantOrbOptions } from './variants.types';

/**
 * Creates a variant orb inside `container` (its canvas fills the container). Each variant is a
 * separate lazy chunk, so only the selected design is downloaded.
 */
export async function createVariantOrb(
    variant: OrbVariant,
    container: HTMLElement,
    options: VariantOrbOptions = {},
): Promise<OrbRenderer> {
    switch (variant) {
        case 'particle': {
            const { ParticleOrb } = await import('./ParticleOrb');
            return new ParticleOrb(container, options);
        }
        case 'halo': {
            const { HaloOrb } = await import('./HaloOrb');
            return new HaloOrb(container, options);
        }
        case 'signal': {
            const { SignalOrb } = await import('./SignalOrb');
            return new SignalOrb(container, options);
        }
        case 'reactor': {
            const { ReactorOrb } = await import('./ReactorOrb');
            return new ReactorOrb(container, options);
        }
        case 'lattice': {
            const { LatticeOrb } = await import('./LatticeOrb');
            return new LatticeOrb(container, options);
        }
    }
}

export { BAND_COUNT, ORB_VARIANTS, ORB_VISUAL_STATES } from './constants';
export { createAudioBuffers, readAudio, createVoiceSimulation, simulateVoice } from './audio';
export type {
    OrbRenderer,
    OrbVariant,
    OrbVisualState,
    OrbQuality,
    VariantOrbOptions,
    AudioAnalyserSource,
    AudioReadBuffers,
    VoiceSimulation,
} from './variants.types';
