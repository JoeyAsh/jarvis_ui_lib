import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createVariantOrb } from '../../variants';
import { ThreeOrb } from '../ThreeOrb';

const engine = vi.hoisted(() => ({
    setState: vi.fn(),
    setAnalyser: vi.fn(),
    destroy: vi.fn(),
}));

const variantOrb = vi.hoisted(() => ({
    setState: vi.fn(),
    setAudio: vi.fn(),
    dispose: vi.fn(),
    resize: vi.fn(),
    onFrame: null as ((dt: number) => void) | null,
    camera: {},
    renderer: { domElement: {} },
}));

const readFrequencies = vi.fn();

const controls = vi.hoisted(() => ({
    update: vi.fn(),
    dispose: vi.fn(),
    created: vi.fn(),
}));

vi.mock('../../orbEngine', () => ({
    createOrb: vi.fn(() => engine),
}));

vi.mock('../../variants', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../variants')>();
    return { ...actual, createVariantOrb: vi.fn(() => Promise.resolve(variantOrb)) };
});

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
    OrbitControls: class {
        enableDamping = false;
        enablePan = true;
        minDistance = 0;
        maxDistance = Infinity;
        constructor() {
            controls.created();
        }
        update(): void {
            controls.update();
        }
        dispose(): void {
            controls.dispose();
        }
    },
}));

beforeEach(() => {
    // jsdom has no Web Audio.
    vi.stubGlobal('AnalyserNode', class {});
});

afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    variantOrb.onFrame = null;
});

describe('ThreeOrb (constellation)', () => {
    it('renders a decorative canvas by default', () => {
        const { container } = render(<ThreeOrb state="idle" />);
        const canvas = container.querySelector('canvas');
        expect(canvas).not.toBeNull();
        expect(canvas?.getAttribute('aria-hidden')).toBe('true');
        expect(canvas?.getAttribute('role')).toBeNull();
        expect(canvas?.classList.contains('lib-three-orb--viewport')).toBe(true);
    });

    it('exposes role="img" with the given aria-label', () => {
        const { getByRole } = render(<ThreeOrb state="idle" aria-label="Assistant idle" />);
        const img = getByRole('img', { name: 'Assistant idle' });
        expect(img.tagName).toBe('CANVAS');
        expect(img.getAttribute('aria-hidden')).toBeNull();
    });

    it('maps working to thinking for the engine', () => {
        render(<ThreeOrb state="working" />);
        expect(engine.setState).toHaveBeenCalledWith('thinking');
    });

    it('passes the analyser to the engine', () => {
        const analyser = fakeAnalyser();
        render(<ThreeOrb state="listening" analyser={analyser} />);
        expect(engine.setAnalyser).toHaveBeenCalledWith(analyser);
    });

    it('destroys the engine on unmount', () => {
        const { unmount } = render(<ThreeOrb state="idle" />);
        unmount();
        expect(engine.destroy).toHaveBeenCalled();
    });

    it('merges className onto the canvas', () => {
        const { container } = render(<ThreeOrb state="idle" className="extra" />);
        expect(container.querySelector('canvas')?.classList.contains('extra')).toBe(true);
    });

    it('wraps the engine canvas when filling a container', () => {
        const { container } = render(<ThreeOrb state="idle" fill="container" aria-label="Orb" />);
        const root = container.firstElementChild;
        expect(root?.tagName).toBe('DIV');
        expect(root?.classList.contains('lib-three-orb--container')).toBe(true);
        expect(root?.getAttribute('role')).toBe('img');
        expect(root?.querySelector('canvas.lib-three-orb__engine')).not.toBeNull();
    });
});

describe('ThreeOrb (variants)', () => {
    it('loads the variant with the given quality and initial state', async () => {
        render(<ThreeOrb state="thinking" variant="halo" quality="low" fill="container" />);
        await waitFor(() => expect(variantOrb.setState).toHaveBeenCalledWith('working'));
        expect(createVariantOrb).toHaveBeenCalledWith('halo', expect.any(HTMLDivElement), {
            quality: 'low',
        });
        expect(engine.destroy).not.toHaveBeenCalled();
    });

    it('maps state changes to the variant states', async () => {
        const { rerender } = render(<ThreeOrb state="idle" variant="signal" />);
        await waitFor(() => expect(variantOrb.setState).toHaveBeenCalledWith('idle'));
        rerender(<ThreeOrb state="follow_up" variant="signal" />);
        expect(variantOrb.setState).toHaveBeenLastCalledWith('listening');
        rerender(<ThreeOrb state="speaking" variant="signal" />);
        expect(variantOrb.setState).toHaveBeenLastCalledWith('speaking');
    });

    it('feeds simulated audio while speaking and silence when idle', async () => {
        const { rerender } = render(<ThreeOrb state="speaking" variant="reactor" />);
        await waitFor(() => expect(variantOrb.onFrame).not.toBeNull());
        variantOrb.onFrame?.(0.5);
        expect(variantOrb.setAudio).toHaveBeenLastCalledWith(
            expect.any(Number),
            expect.any(Float32Array),
        );
        rerender(<ThreeOrb state="idle" variant="reactor" />);
        variantOrb.onFrame?.(0.016);
        expect(variantOrb.setAudio).toHaveBeenLastCalledWith(0);
    });

    it('reads the analyser while listening', async () => {
        const analyser = fakeAnalyser();
        render(<ThreeOrb state="listening" variant="lattice" analyser={analyser} />);
        await waitFor(() => expect(variantOrb.onFrame).not.toBeNull());
        variantOrb.onFrame?.(0.016);
        expect(readFrequencies).toHaveBeenCalled();
        expect(variantOrb.setAudio).toHaveBeenLastCalledWith(0, expect.any(Float32Array));
    });

    it('disposes the variant on unmount and on variant change', async () => {
        const { rerender, unmount } = render(<ThreeOrb state="idle" variant="particle" />);
        await waitFor(() => expect(variantOrb.setState).toHaveBeenCalled());
        rerender(<ThreeOrb state="idle" variant="halo" />);
        expect(variantOrb.dispose).toHaveBeenCalledTimes(1);
        await waitFor(() => expect(createVariantOrb).toHaveBeenCalledTimes(2));
        unmount();
        await waitFor(() => expect(variantOrb.dispose).toHaveBeenCalledTimes(2));
    });

    it('creates and cleans up orbit controls when interactive', async () => {
        const { container, unmount } = render(
            <ThreeOrb state="idle" variant="halo" interactive fill="container" />,
        );
        expect(container.firstElementChild?.classList.contains('lib-three-orb--interactive')).toBe(
            true,
        );
        await waitFor(() => expect(controls.created).toHaveBeenCalled());
        await waitFor(() => expect(variantOrb.onFrame).not.toBeNull());
        variantOrb.onFrame?.(0.016);
        expect(controls.update).toHaveBeenCalled();
        unmount();
        expect(controls.dispose).toHaveBeenCalled();
    });

    it('renders a decorative div root', () => {
        const { container } = render(<ThreeOrb state="idle" variant="halo" />);
        const root = container.firstElementChild;
        expect(root?.tagName).toBe('DIV');
        expect(root?.getAttribute('aria-hidden')).toBe('true');
        expect(root?.classList.contains('lib-three-orb--viewport')).toBe(true);
    });
});

/** Minimal AnalyserNode stand-in with the members the orb reads. */
function fakeAnalyser(): AnalyserNode {
    const node = Object.create(AnalyserNode.prototype) as AnalyserNode;
    Object.defineProperties(node, {
        fftSize: { value: 1024 },
        frequencyBinCount: { value: 512 },
        context: { value: { sampleRate: 48000 } },
        getByteFrequencyData: { value: readFrequencies },
        getFloatTimeDomainData: { value: vi.fn() },
    });
    return node;
}
