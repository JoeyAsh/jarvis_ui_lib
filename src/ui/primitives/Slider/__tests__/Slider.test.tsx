import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Slider } from '../Slider';
import { snapValue, toPercent, valueFromKey, valueFromPointer } from '../utils';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

/** The track is the parent of the thumb; give it a 200px wide box at x = 100. */
function mockTrack(): HTMLElement {
    const track = screen.getByRole('slider').parentElement as HTMLElement;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 0, 200, 16));
    return track;
}

beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = vi.fn();
    HTMLElement.prototype.releasePointerCapture = vi.fn();
    HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Slider utils', () => {
    it('snaps to the step and clamps to the range', () => {
        expect(snapValue(43, 0, 100, 5)).toBe(45);
        expect(snapValue(120, 0, 100, 5)).toBe(100);
        expect(snapValue(0.30000000000000004, 0, 1, 0.1)).toBe(0.3);
    });

    it('maps pointer position and keys to values', () => {
        expect(valueFromPointer(150, 100, 200, 0, 100, 1)).toBe(25);
        expect(toPercent(25, 0, 50)).toBe(50);
        expect(valueFromKey('PageUp', 10, 0, 100, 1)).toBe(20);
        expect(valueFromKey('End', 10, 0, 100, 1)).toBe(100);
        expect(valueFromKey('a', 10, 0, 100, 1)).toBeNull();
    });
});

describe('Slider', () => {
    it('renders a slider named by its label with the range in ARIA', () => {
        render(<Slider label="Volume" defaultValue={40} />);
        const slider = screen.getByRole('slider', { name: 'Volume' });
        expect(slider.getAttribute('aria-valuenow')).toBe('40');
        expect(slider.getAttribute('aria-valuemin')).toBe('0');
        expect(slider.getAttribute('aria-valuemax')).toBe('100');
    });

    it('uses aria-label without a visible label', () => {
        render(<Slider aria-label="Seek" />);
        expect(screen.getByRole('slider', { name: 'Seek' })).toBeDefined();
    });

    it('shows the formatted value and exposes it as aria-valuetext', () => {
        render(<Slider label="Volume" defaultValue={40} showValue formatValue={(v) => `${v} %`} />);
        expect(screen.getByText('40 %')).toBeDefined();
        expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('40 %');
    });

    it('uncontrolled: arrow keys change the value and commit it', () => {
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();
        render(
            <Slider
                aria-label="Volume"
                defaultValue={40}
                step={5}
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
            />,
        );
        const slider = screen.getByRole('slider');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        expect(slider.getAttribute('aria-valuenow')).toBe('45');
        expect(onValueChange).toHaveBeenCalledWith(45);
        expect(onValueCommit).toHaveBeenCalledWith(45);
        fireEvent.keyDown(slider, { key: 'Home' });
        expect(slider.getAttribute('aria-valuenow')).toBe('0');
    });

    it('controlled: reports the next value and keeps the prop value', () => {
        const onValueChange = vi.fn();
        render(<Slider aria-label="Volume" value={40} onValueChange={onValueChange} />);
        fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowUp' });
        expect(onValueChange).toHaveBeenCalledWith(41);
        expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('40');
    });

    it('drags along the track, plays drag sounds and commits once', () => {
        const sfx = makeSfx();
        const onValueChange = vi.fn();
        const onValueCommit = vi.fn();
        renderWithSfx(
            sfx,
            <Slider
                aria-label="Volume"
                onValueChange={onValueChange}
                onValueCommit={onValueCommit}
            />,
        );
        const track = mockTrack();
        fireEvent.pointerDown(track, { button: 0, pointerId: 1, clientX: 150 });
        fireEvent.pointerMove(track, { pointerId: 1, clientX: 250 });
        fireEvent.pointerUp(track, { pointerId: 1, clientX: 250 });
        expect(onValueChange).toHaveBeenNthCalledWith(1, 25);
        expect(onValueChange).toHaveBeenNthCalledWith(2, 75);
        expect(onValueCommit).toHaveBeenCalledTimes(1);
        expect(onValueCommit).toHaveBeenCalledWith(75);
        expect(sfx.playOneShot).toHaveBeenCalledWith('drag_start');
        expect(sfx.playOneShot).toHaveBeenCalledWith('drag_end');
    });

    it('disabled ignores keys and pointer', () => {
        const onValueChange = vi.fn();
        render(<Slider aria-label="Volume" disabled onValueChange={onValueChange} />);
        const slider = screen.getByRole('slider');
        expect(slider.getAttribute('aria-disabled')).toBe('true');
        fireEvent.keyDown(slider, { key: 'ArrowRight' });
        fireEvent.pointerDown(mockTrack(), { button: 0, pointerId: 1, clientX: 200 });
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('merges className onto the root', () => {
        const { container } = render(<Slider aria-label="Volume" className="w-full" />);
        expect(container.firstElementChild?.className).toContain('w-full');
    });
});
