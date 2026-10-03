import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Copy } from 'lucide-react';
import { IconButton } from '../IconButton';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function renderWithSfx(sfx: SfxContextValue, ui: ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('IconButton', () => {
    it('renders a button named by label', () => {
        render(<IconButton icon={Copy} label="Copy code" />);
        expect(screen.getByRole('button', { name: 'Copy code' })).toBeDefined();
    });

    it('defaults to type=button', () => {
        render(<IconButton icon={Copy} label="Copy" />);
        expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    });

    it('renders the icon as decorative svg', () => {
        const { container } = render(<IconButton icon={Copy} label="Copy" />);
        expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('variant=primary has bg-accent', () => {
        render(<IconButton icon={Copy} label="Copy" variant="primary" />);
        expect(screen.getByRole('button').className).toContain('bg-accent');
    });

    it('size=sm is 24px', () => {
        render(<IconButton icon={Copy} label="Copy" size="sm" />);
        expect(screen.getByRole('button').className).toContain('w-[24px]');
    });

    it('pressed sets aria-pressed', () => {
        render(<IconButton icon={Copy} label="Copy" pressed />);
        expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true');
    });

    it('merges className', () => {
        render(<IconButton icon={Copy} label="Copy" className="extra" />);
        expect(screen.getByRole('button').className).toContain('extra');
    });

    it('fires onClick and plays click', () => {
        const sfx = makeSfx();
        const onClick = vi.fn();
        renderWithSfx(sfx, <IconButton icon={Copy} label="Copy" onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('plays hover_button on mouseenter', () => {
        const sfx = makeSfx();
        renderWithSfx(sfx, <IconButton icon={Copy} label="Copy" />);
        fireEvent.mouseEnter(screen.getByRole('button'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
    });
});
