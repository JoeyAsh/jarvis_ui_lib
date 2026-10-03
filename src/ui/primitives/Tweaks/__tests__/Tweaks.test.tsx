import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, renderHook } from '@testing-library/react';
import React from 'react';
import { Tweaks } from '../Tweaks';
import { TWEAKS_DEFAULTS, TWEAK_CSS_VARS } from '../constants';
import { useTweakApply } from '../useTweakApply';
import * as folderIndex from '../index';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';
import type { SfxEvent } from '@core/audio';

type MockFn = ReturnType<typeof vi.fn> & ((event: SfxEvent) => void);

function makeSfx(): { playOneShot: MockFn; play: MockFn; stop: MockFn } & SfxContextValue {
    return { playOneShot: vi.fn() as MockFn, play: vi.fn() as MockFn, stop: vi.fn() as MockFn };
}

function renderWithSfx(sfx: SfxContextValue, ui: React.ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('Tweaks — visual', () => {
    it('renders without crashing', () => {
        const { container } = render(
            <Tweaks open={false} tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        expect(container.querySelector('.lib-tweaks')).toBeDefined();
    });

    it('does not have open class when open=false', () => {
        const { container } = render(
            <Tweaks open={false} tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        expect(container.querySelector('.lib-tweaks')?.classList.contains('open')).toBe(false);
    });

    it('has open class when open=true', () => {
        const { container } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        expect(container.querySelector('.lib-tweaks')?.classList.contains('open')).toBe(true);
    });

    it('renders heading', () => {
        const { getByText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        expect(getByText('◈ TWEAKS')).toBeDefined();
    });

    it('renders hue slider with current value', () => {
        const { getByLabelText } = render(
            <Tweaks open tweaks={{ ...TWEAKS_DEFAULTS, hue: 180 }} onChange={() => undefined} />,
        );
        expect(getByLabelText(/Accent Hue/).getAttribute('value')).toBe('180');
    });

    it('calls onChange when hue slider changes', () => {
        const handler = vi.fn();
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={handler} />,
        );
        fireEvent.change(getByLabelText(/Accent Hue/), { target: { value: '100' } });
        expect(handler).toHaveBeenCalledWith({ ...TWEAKS_DEFAULTS, hue: 100 });
    });

    it('calls onChange when glow slider changes', () => {
        const handler = vi.fn();
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={handler} />,
        );
        fireEvent.change(getByLabelText(/Glow intensity/), { target: { value: '50' } });
        expect(handler).toHaveBeenCalledWith({ ...TWEAKS_DEFAULTS, glow: 50 });
    });

    it('generates unique slider ids across two panels', () => {
        const { container } = render(
            <>
                <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />
                <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />
            </>,
        );
        const sliders = Array.from(
            container.querySelectorAll<HTMLInputElement>('input[type="range"]'),
        );
        expect(sliders).toHaveLength(4);
        const ids = sliders.map((s) => s.id);
        expect(ids.every((id) => id.length > 0)).toBe(true);
        expect(new Set(ids).size).toBe(4);
        expect(ids).not.toContain('lib-tweaks-hue');
        for (const slider of sliders) {
            expect(container.querySelector(`label[for="${slider.id}"]`)).not.toBeNull();
        }
    });

    it('calls onChange when Scanlines toggle clicked', () => {
        const handler = vi.fn();
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={handler} />,
        );
        fireEvent.click(getByLabelText('Scanlines'));
        expect(handler).toHaveBeenCalledWith({ ...TWEAKS_DEFAULTS, scan: false });
    });

    it('calls onChange when Grid toggle clicked', () => {
        const handler = vi.fn();
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={handler} />,
        );
        fireEvent.click(getByLabelText('Grid'));
        expect(handler).toHaveBeenCalledWith({ ...TWEAKS_DEFAULTS, grid: false });
    });

    it('calls onChange when swatch clicked', () => {
        const handler = vi.fn();
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={handler} />,
        );
        fireEvent.click(getByLabelText('Hue 28'));
        expect(handler).toHaveBeenCalledWith({ ...TWEAKS_DEFAULTS, hue: 28 });
    });

    it('active swatch has active class', () => {
        const { getByLabelText } = render(
            <Tweaks open tweaks={{ ...TWEAKS_DEFAULTS, hue: 215 }} onChange={() => undefined} />,
        );
        expect(getByLabelText('Hue 215').classList.contains('active')).toBe(true);
    });

    it('marks the selected swatch aria-pressed', () => {
        const { getByLabelText } = render(
            <Tweaks open tweaks={{ ...TWEAKS_DEFAULTS, hue: 28 }} onChange={() => undefined} />,
        );
        expect(getByLabelText('Hue 28').getAttribute('aria-pressed')).toBe('true');
        expect(getByLabelText('Hue 215').getAttribute('aria-pressed')).toBe('false');
    });

    it('colors swatches through a CSS variable instead of an inline background', () => {
        const { getByLabelText } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        const swatch = getByLabelText('Hue 150');
        expect(swatch.style.getPropertyValue('--lib-tweaks-swatch-hue')).toBe('150');
        expect(swatch.style.background).toBe('');
    });

    it('merges className', () => {
        const { container } = render(
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} className="extra" />,
        );
        expect(container.querySelector('.lib-tweaks')?.classList.contains('extra')).toBe(true);
    });
});

describe('Tweaks — SFX', () => {
    it('plays click when toggle button is clicked', () => {
        const sfx = makeSfx();
        const { getByLabelText } = renderWithSfx(
            sfx,
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        fireEvent.click(getByLabelText('Scanlines'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('plays click when swatch is clicked', () => {
        const sfx = makeSfx();
        const { getByLabelText } = renderWithSfx(
            sfx,
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        fireEvent.click(getByLabelText('Hue 28'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('plays hover_button on mouseenter of toggle', () => {
        const sfx = makeSfx();
        const { getByLabelText } = renderWithSfx(
            sfx,
            <Tweaks open tweaks={TWEAKS_DEFAULTS} onChange={() => undefined} />,
        );
        fireEvent.mouseEnter(getByLabelText('Scanlines'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
    });
});

describe('useTweakApply', () => {
    afterEach(() => {
        TWEAK_CSS_VARS.forEach((name) => document.documentElement.style.removeProperty(name));
    });

    it('writes the accent and glow variables to :root', () => {
        renderHook(() => useTweakApply({ ...TWEAKS_DEFAULTS, hue: 120 }));
        const style = document.documentElement.style;
        expect(style.getPropertyValue('--tweak-hue')).toBe('120');
        expect(style.getPropertyValue('--accent')).toBe('oklch(0.72 0.14 120)');
        for (const name of TWEAK_CSS_VARS) {
            expect(style.getPropertyValue(name)).not.toBe('');
        }
    });

    it('updates the variables when the hue changes', () => {
        const { rerender } = renderHook(
            (props: { hue: number }) => useTweakApply({ ...TWEAKS_DEFAULTS, hue: props.hue }),
            { initialProps: { hue: 10 } },
        );
        rerender({ hue: 300 });
        expect(document.documentElement.style.getPropertyValue('--tweak-hue')).toBe('300');
    });

    it('removes every variable it set on unmount', () => {
        const { unmount } = renderHook(() => useTweakApply(TWEAKS_DEFAULTS));
        expect(document.documentElement.style.getPropertyValue('--accent')).not.toBe('');
        unmount();
        for (const name of TWEAK_CSS_VARS) {
            expect(document.documentElement.style.getPropertyValue(name)).toBe('');
        }
    });

    it('is exported from the folder index together with TWEAKS_DEFAULTS', () => {
        expect(folderIndex.useTweakApply).toBe(useTweakApply);
        expect(folderIndex.TWEAKS_DEFAULTS).toBe(TWEAKS_DEFAULTS);
    });
});
