import { Suspense, lazy, useEffect, useState } from 'react';
import { Button, Mono, Switch, useToast } from 'jarvis-react-ui';
import type { ThreeOrbVariant } from 'jarvis-react-ui/orb';

const ThreeOrb = lazy(() => import('jarvis-react-ui/orb').then((m) => ({ default: m.ThreeOrb })));

const VARIANTS: Record<ThreeOrbVariant, string> = {
    constellation: 'The original orb: particle cloud with connecting lines (default).',
    particle: 'Glowing core, particle shell, tilted orbital rings and shockwaves.',
    halo: 'Particle orb with finer points, a faint inner shell and softer rings.',
    signal: 'Particle orb with traveling light currents and clearer orbital arcs.',
    reactor: 'Energy core, counter-rotating segmented rings, amber telemetry, audio iris.',
    lattice: 'Faceted crystal core, geodesic lattice, tick rings and a 128-bar spectrum.',
};
const STATES = ['idle', 'listening', 'working', 'speaking'] as const;
type DemoState = (typeof STATES)[number];

export default function VariantPlayground() {
    const { toast } = useToast();
    const [variant, setVariant] = useState<ThreeOrbVariant>('particle');
    const [state, setState] = useState<DemoState>('idle');
    const [lowQuality, setLowQuality] = useState(false);
    const [cycle, setCycle] = useState(false);
    const [mic, setMic] = useState(false);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    // Demo cycle: next state every 5 s.
    useEffect(() => {
        if (!cycle) return undefined;
        const id = window.setInterval(() => {
            setState((s) => STATES[(STATES.indexOf(s) + 1) % STATES.length] ?? 'idle');
        }, 5000);
        return () => window.clearInterval(id);
    }, [cycle]);

    // Microphone → AnalyserNode (processed locally, nothing is sent).
    useEffect(() => {
        if (!mic) return undefined;
        let ctx: AudioContext | null = null;
        let stream: MediaStream | null = null;
        let cancelled = false;
        navigator.mediaDevices
            .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
            .then((media) => {
                stream = media;
                if (cancelled) return;
                ctx = new AudioContext();
                const node = ctx.createAnalyser();
                node.fftSize = 1024;
                node.smoothingTimeConstant = 0.55;
                ctx.createMediaStreamSource(media).connect(node);
                setAnalyser(node);
                setState('listening');
            })
            .catch(() => {
                toast({ title: 'Microphone unavailable', variant: 'error' });
                setMic(false);
            });
        return () => {
            cancelled = true;
            stream?.getTracks().forEach((track) => track.stop());
            void ctx?.close();
            setAnalyser(null);
        };
    }, [mic, toast]);

    return (
        <div className="relative flex h-full w-full flex-col">
            <div className="absolute inset-0">
                <Suspense fallback={<Mono muted>Loading orb…</Mono>}>
                    <ThreeOrb
                        state={state}
                        variant={variant}
                        quality={lowQuality ? 'low' : 'high'}
                        analyser={analyser}
                        fill="container"
                        interactive
                    />
                </Suspense>
            </div>
            <div className="pointer-events-none relative z-10 flex flex-wrap gap-2 p-3">
                {(Object.keys(VARIANTS) as ThreeOrbVariant[]).map((v) => (
                    <Button
                        key={v}
                        size="sm"
                        variant={v === variant ? 'primary' : 'ghost'}
                        aria-pressed={v === variant}
                        onClick={() => setVariant(v)}
                        className="pointer-events-auto"
                    >
                        {v}
                    </Button>
                ))}
            </div>
            <div className="pointer-events-none relative z-10 mt-auto flex flex-col gap-3 p-3">
                <Mono muted size="sm">
                    {VARIANTS[variant]} Drag to rotate, scroll to zoom.
                </Mono>
                <div className="flex flex-wrap items-center gap-2">
                    {STATES.map((s) => (
                        <Button
                            key={s}
                            size="sm"
                            variant={s === state ? 'secondary' : 'ghost'}
                            aria-pressed={s === state}
                            onClick={() => setState(s)}
                            className="pointer-events-auto"
                        >
                            {s}
                        </Button>
                    ))}
                    <Switch
                        size="sm"
                        label="Mic"
                        checked={mic}
                        onCheckedChange={setMic}
                        className="pointer-events-auto"
                    />
                    <Switch
                        size="sm"
                        label="Demo cycle"
                        checked={cycle}
                        onCheckedChange={setCycle}
                        className="pointer-events-auto"
                    />
                    <Switch
                        size="sm"
                        label="Low quality"
                        checked={lowQuality}
                        onCheckedChange={setLowQuality}
                        className="pointer-events-auto"
                    />
                </div>
            </div>
        </div>
    );
}
