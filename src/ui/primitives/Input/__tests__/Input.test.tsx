import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Input } from '../Input';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('Input', () => {
    it('renders a textbox with its placeholder', () => {
        render(<Input placeholder="Search…" />);
        expect(screen.getByPlaceholderText('Search…')).toBeDefined();
    });

    it('forwards value changes to onChange', () => {
        const onChange = vi.fn();
        render(<Input aria-label="query" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox', { name: 'query' }), {
            target: { value: 'orb' },
        });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('renders start and end adornments', () => {
        render(
            <Input aria-label="q" startAdornment={<span>S</span>} endAdornment={<span>E</span>} />,
        );
        expect(screen.getByText('S')).toBeDefined();
        expect(screen.getByText('E')).toBeDefined();
    });

    it('invalid sets aria-invalid and the error border', () => {
        const { container } = render(<Input aria-label="q" invalid />);
        expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
        expect(container.firstElementChild?.className).toContain('border-error');
    });

    it('size=sm uses the small height', () => {
        const { container } = render(<Input aria-label="q" size="sm" />);
        expect(container.firstElementChild?.className).toContain('h-[26px]');
    });

    it('fullWidth stretches the frame', () => {
        const { container } = render(<Input aria-label="q" fullWidth />);
        expect(container.firstElementChild?.className).toContain('w-full');
    });

    it('passes className to the frame and inputClassName to the input', () => {
        const { container } = render(
            <Input aria-label="q" className="frame-x" inputClassName="input-x" />,
        );
        expect(container.firstElementChild?.className).toContain('frame-x');
        expect(screen.getByRole('textbox').className).toContain('input-x');
    });

    it('disabled disables the native input', () => {
        render(<Input aria-label="q" disabled />);
        expect(screen.getByRole<HTMLInputElement>('textbox').disabled).toBe(true);
    });

    it('plays hover_button on mouseenter', () => {
        const sfx = makeSfx();
        const { container } = renderWithSfx(sfx, <Input aria-label="q" />);
        const frame = container.firstElementChild;
        if (frame) fireEvent.mouseEnter(frame);
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
    });
});
