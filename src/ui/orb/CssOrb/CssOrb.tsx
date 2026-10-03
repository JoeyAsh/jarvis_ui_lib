import { useEffect, useRef, type CSSProperties, type ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import type { CssOrbProps, ParticleConfig } from './CssOrb.types';
import { particleTransform, reducedMotionQuery } from './utils';

const TICK_ANGLES = Array.from({ length: 36 }, (_, i) => i * 10);

const PARTICLE_CONFIGS: ParticleConfig[] = [
    { radius: 180, dir: 1, period: 10, phase: 0.0, size: 3, colorVar: '--accent-bright' },
    { radius: 210, dir: -1, period: 14, phase: 1.05, size: 2, colorVar: '--accent' },
    { radius: 240, dir: 1, period: 16, phase: 2.1, size: 2, colorVar: '--accent-bright' },
    { radius: 265, dir: -1, period: 20, phase: 3.15, size: 3, colorVar: '--accent' },
    { radius: 295, dir: 1, period: 24, phase: 4.2, size: 2, colorVar: '--accent-speak' },
    { radius: 330, dir: -1, period: 28, phase: 5.25, size: 3, colorVar: '--accent-bright' },
];

export function CssOrb({
    state,
    rings = true,
    particles = true,
    className,
    'aria-label': ariaLabel,
}: CssOrbProps): ReactElement {
    const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const stop = (): void => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
            }
        };

        if (!particles) {
            stop();
            return;
        }

        const place = (t: number): void => {
            PARTICLE_CONFIGS.forEach((cfg, i) => {
                const el = particleRefs.current[i];
                if (el) el.style.transform = particleTransform(cfg, t);
            });
        };

        const loop = (timestamp: number): void => {
            place(timestamp / 1000);
            rafRef.current = requestAnimationFrame(loop);
        };

        const query = reducedMotionQuery();

        // Reduced motion: park the particles at their start angle and skip the frame loop.
        const start = (): void => {
            stop();
            if (query?.matches) {
                place(0);
                return;
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        start();
        query?.addEventListener('change', start);

        return () => {
            query?.removeEventListener('change', start);
            stop();
        };
    }, [particles]);

    const isWorking = state === 'working';
    const a11yProps =
        ariaLabel !== undefined
            ? { role: 'img', 'aria-label': ariaLabel }
            : { 'aria-hidden': true as const };

    return (
        <div className={cx('orb-wrap', isWorking && 'is-working', className)} {...a11yProps}>
            {rings && (
                <>
                    <div className="orb-ring r5" />
                    <div className="orb-ring r4" />
                    <div className="orb-ring r3" />
                    <div className="orb-ring r2" />
                    <div className="orb-ring-ticks" aria-hidden>
                        {TICK_ANGLES.map((deg) => (
                            <i key={deg} style={{ '--tick-angle': `${deg}deg` } as CSSProperties} />
                        ))}
                    </div>
                    <div className="orb-ring r1" />
                </>
            )}

            <div className={`orb state-${state}`} aria-hidden />

            <div className="pulse d1" aria-hidden />
            <div className="pulse d2" aria-hidden />
            <div className="pulse d3" aria-hidden />

            {particles &&
                PARTICLE_CONFIGS.map((cfg, i) => (
                    <div
                        key={i}
                        className="particle"
                        aria-hidden
                        style={
                            {
                                '--particle-size': `${cfg.size}px`,
                                '--particle-color': `var(${cfg.colorVar})`,
                            } as CSSProperties
                        }
                        ref={(el) => {
                            particleRefs.current[i] = el;
                        }}
                    />
                ))}
        </div>
    );
}

export { CssOrb as default };
