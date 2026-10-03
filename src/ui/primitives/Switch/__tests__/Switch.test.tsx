import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Switch } from '../Switch';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('Switch', () => {
    it('renders a switch named by its label', () => {
        render(<Switch label="Sound" />);
        expect(screen.getByRole('switch', { name: 'Sound' })).toBeDefined();
    });

    it('uncontrolled: toggles aria-checked on click', () => {
        render(<Switch label="Sound" />);
        const sw = screen.getByRole('switch');
        expect(sw.getAttribute('aria-checked')).toBe('false');
        fireEvent.click(sw);
        expect(sw.getAttribute('aria-checked')).toBe('true');
    });

    it('defaultChecked starts on', () => {
        render(<Switch label="Sound" defaultChecked />);
        expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    });

    it('controlled: reports the next value and keeps the prop value', () => {
        const onCheckedChange = vi.fn();
        render(<Switch label="Sound" checked={false} onCheckedChange={onCheckedChange} />);
        const sw = screen.getByRole('switch');
        fireEvent.click(sw);
        expect(onCheckedChange).toHaveBeenCalledWith(true);
        expect(sw.getAttribute('aria-checked')).toBe('false');
    });

    it('disabled does not toggle', () => {
        const onCheckedChange = vi.fn();
        render(<Switch label="Sound" disabled onCheckedChange={onCheckedChange} />);
        fireEvent.click(screen.getByRole('switch'));
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('size=sm uses the small track', () => {
        const { container } = render(<Switch label="S" size="sm" />);
        expect(container.querySelector('[aria-hidden="true"]')?.className).toContain('w-[24px]');
    });

    it('merges className', () => {
        render(<Switch label="S" className="extra" />);
        expect(screen.getByRole('switch').className).toContain('extra');
    });

    it('plays click and hover sounds', () => {
        const sfx = makeSfx();
        renderWithSfx(sfx, <Switch label="S" />);
        const sw = screen.getByRole('switch');
        fireEvent.mouseEnter(sw);
        fireEvent.click(sw);
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('aria-checked always reflects the state and cannot be overridden', () => {
        render(<Switch label="S" aria-checked="mixed" />);
        expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    });
});
