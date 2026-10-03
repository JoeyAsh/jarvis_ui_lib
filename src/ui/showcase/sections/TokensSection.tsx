import type { CSSProperties, ReactElement } from 'react';
import { Divider } from '../../primitives/Divider';
import { Mono } from '../../primitives/Mono';
import { SectionHeader } from '../SectionHeader';
import type { Swatch } from './TokensSection.types';

const SWATCHES: Swatch[] = [
    { name: 'bg', value: '#050508', cssVar: '--bg', border: true },
    { name: 'surface', value: '#0d0d14', cssVar: '--surface' },
    { name: 'surface-raised', value: '#12121c', cssVar: '--surface-raised' },
    { name: 'border', value: '#1a1a2e', cssVar: '--border' },
    { name: 'border-bright', value: '#2a3d4f', cssVar: '--border-bright' },
    { name: 'accent', value: '#4ca8e8', cssVar: '--accent' },
    { name: 'accent-bright', value: '#6ec4ff', cssVar: '--accent-bright' },
    { name: 'accent-speak', value: '#5ab8f0', cssVar: '--accent-speak' },
    { name: 'accent-dim', value: '#2d6aa1', cssVar: '--accent-dim' },
    { name: 'text', value: '#e8f4ff', cssVar: '--text' },
    { name: 'text-secondary', value: '#6b8fa8', cssVar: '--text-secondary' },
    { name: 'text-muted', value: '#2a3d4f', cssVar: '--text-muted' },
    { name: 'warning', value: '#e8b24c', cssVar: '--warning' },
    { name: 'error', value: '#e85a5a', cssVar: '--error' },
    { name: 'success', value: '#4ce8a8', cssVar: '--success' },
];

/* ---- Spacing scale ---- */

const SPACING: { label: string; size: number }[] = [
    { label: '4', size: 4 },
    { label: '8', size: 8 },
    { label: '12', size: 12 },
    { label: '16', size: 16 },
    { label: '24', size: 24 },
    { label: '32', size: 32 },
    { label: '48', size: 48 },
    { label: '64', size: 64 },
];

/* ---- Radius samples (class lookup) ---- */

const RADII: { label: string; className: string }[] = [
    { label: '2px (sharp)', className: 'rounded-[2px]' },
    { label: '4px (max allowed)', className: 'rounded-[4px]' },
    { label: 'full (circles only)', className: 'rounded-full' },
];

/* ---- Glow samples (Tailwind theme utilities) ---- */

const SHADOWS: { label: string; className: string }[] = [
    { label: 'glow', className: 'shadow-glow' },
    { label: 'glow-strong', className: 'shadow-glow-strong' },
    { label: 'glow-inner', className: 'shadow-glow-inner' },
    { label: 'glow-warn', className: 'shadow-glow-warn' },
    { label: 'glow-error', className: 'shadow-glow-error' },
];

export function TokensSection(): ReactElement {
    return (
        <section id="tokens" className="flex flex-col gap-4">
            <SectionHeader title="Tokens">
                Colors · Spacing · Radius · Glow — CSS custom properties in tokens.css, mapped to
                Tailwind utilities in index.css. Typography samples live under Text &amp; Data.
            </SectionHeader>

            <Divider label="Colors" />
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 xl:grid-cols-5">
                {SWATCHES.map((sw) => (
                    <div key={sw.cssVar} className="border border-border p-[10px]">
                        <div
                            className={[
                                'mb-2 h-[42px] bg-[var(--swatch)]',
                                sw.border ? 'border border-border' : '',
                            ].join(' ')}
                            style={{ '--swatch': `var(${sw.cssVar})` } as CSSProperties}
                        />
                        <Mono size="sm">{sw.name}</Mono>
                        <Mono size="xs" muted className="block uppercase">
                            {sw.value}
                        </Mono>
                    </div>
                ))}
            </div>

            <Divider label="Spacing (px)" />
            <div className="flex flex-wrap items-end gap-3 border border-border bg-[rgba(13,13,20,0.75)] p-4">
                {SPACING.map(({ label, size }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <div
                            className="size-[var(--size)] bg-accent opacity-50"
                            style={{ '--size': `${size}px` } as CSSProperties}
                        />
                        <Mono size="xs" muted>
                            {label}
                        </Mono>
                    </div>
                ))}
            </div>

            <Divider label="Radius" />
            <div className="flex flex-wrap items-center gap-4">
                {RADII.map(({ label, className }) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                        <div
                            className={`h-8 w-20 border border-border bg-surface-raised ${className}`}
                        />
                        <Mono size="xs" muted>
                            {label}
                        </Mono>
                    </div>
                ))}
            </div>

            <Divider label="Glow" />
            <div className="flex flex-wrap gap-4">
                {SHADOWS.map(({ label, className }) => (
                    <div
                        key={label}
                        className={`flex h-10 w-[120px] items-center justify-center border border-border bg-surface-raised ${className}`}
                    >
                        <span className="text-[8px] uppercase tracking-[1px] text-accent">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default TokensSection;
