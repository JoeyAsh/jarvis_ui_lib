/**
 * ThreeOrb — React wrapper around the WebGL orbs.
 *
 * `constellation` drives the original engine (ui/orb/orbEngine.ts) through `createOrb()`; the
 * other variants are lazily loaded from ui/orb/variants through `createVariantOrb()`.
 */
import { useEffect, useRef, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { createOrb } from '../orbEngine';
import type { Orb } from '../orbEngine';
import {
    createAudioBuffers,
    createVariantOrb,
    createVoiceSimulation,
    readAudio,
    simulateVoice,
} from '../variants';
import type { OrbRenderer } from '../variants';
import { toConstellationState, toVariantState } from './utils';
import type { ThreeOrbProps } from './ThreeOrb.types';

export function ThreeOrb({
    state,
    variant = 'constellation',
    quality = 'high',
    interactive = false,
    analyser = null,
    fill = 'viewport',
    className,
    'aria-label': ariaLabel,
}: ThreeOrbProps): ReactElement {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const engineRef = useRef<Orb | null>(null);
    const rendererRef = useRef<OrbRenderer | null>(null);
    const stateRef = useRef(state);
    const analyserRef = useRef(analyser);
    const isConstellation = variant === 'constellation';

    // Original engine.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!isConstellation || canvas === null) return undefined;
        const orb = createOrb(canvas, { alpha: true });
        engineRef.current = orb;
        orb.setState(toConstellationState(stateRef.current));
        orb.setAnalyser(analyserRef.current);
        return () => {
            orb.destroy();
            engineRef.current = null;
        };
    }, [isConstellation]);

    // Variant designs (lazy).
    useEffect(() => {
        const container = containerRef.current;
        if (variant === 'constellation' || container === null) return undefined;
        let cancelled = false;
        let orb: OrbRenderer | null = null;
        let disposeControls: (() => void) | null = null;
        const voice = createVoiceSimulation();
        let buffers: ReturnType<typeof createAudioBuffers> | null = null;
        let buffersFor: AnalyserNode | null = null;

        void createVariantOrb(variant, container, { quality }).then(async (created) => {
            if (cancelled) {
                created.dispose();
                return;
            }
            orb = created;
            rendererRef.current = created;
            created.setState(toVariantState(stateRef.current));

            let updateControls: (() => void) | null = null;
            if (interactive) {
                const { OrbitControls } =
                    await import('three/examples/jsm/controls/OrbitControls.js');
                if (cancelled) return;
                const controls = new OrbitControls(created.camera, created.renderer.domElement);
                controls.enableDamping = true;
                controls.enablePan = false;
                controls.minDistance = 4;
                controls.maxDistance = 14;
                updateControls = () => controls.update();
                disposeControls = () => controls.dispose();
            }

            created.onFrame = (dt) => {
                const visual = toVariantState(stateRef.current);
                const source = analyserRef.current;
                if (visual === 'listening' || visual === 'speaking') {
                    if (source !== null) {
                        if (buffers === null || buffersFor !== source) {
                            buffers = createAudioBuffers(source);
                            buffersFor = source;
                        }
                        created.setAudio(readAudio(source, buffers), buffers.bands);
                    } else {
                        const level = simulateVoice(voice, dt, visual === 'listening' ? 0.9 : 1);
                        created.setAudio(level, voice.bands);
                    }
                } else {
                    created.setAudio(0);
                }
                updateControls?.();
            };
        });

        return () => {
            cancelled = true;
            disposeControls?.();
            orb?.dispose();
            rendererRef.current = null;
        };
    }, [variant, quality, interactive]);

    useEffect(() => {
        stateRef.current = state;
        engineRef.current?.setState(toConstellationState(state));
        rendererRef.current?.setState(toVariantState(state));
    }, [state]);

    useEffect(() => {
        analyserRef.current = analyser;
        engineRef.current?.setAnalyser(analyser);
    }, [analyser]);

    const a11yProps =
        ariaLabel !== undefined
            ? { role: 'img', 'aria-label': ariaLabel }
            : { 'aria-hidden': true as const };

    const rootClass = cx(
        'lib-three-orb',
        fill === 'viewport' ? 'lib-three-orb--viewport' : 'lib-three-orb--container',
        interactive && !isConstellation && 'lib-three-orb--interactive',
        className,
    );

    if (isConstellation && fill === 'viewport') {
        return <canvas ref={canvasRef} {...a11yProps} className={rootClass} />;
    }

    if (isConstellation) {
        return (
            <div {...a11yProps} className={rootClass}>
                <canvas ref={canvasRef} className="lib-three-orb__engine" />
            </div>
        );
    }

    return <div ref={containerRef} {...a11yProps} className={rootClass} />;
}

export default ThreeOrb;
