import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';
import type { SelectOption } from '../Select.types';
import { typeaheadIndex } from '../utils';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

const OPTIONS: SelectOption[] = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français', disabled: true },
    { value: 'es', label: 'Español' },
];

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function trigger(): HTMLElement {
    return screen.getByRole('combobox');
}

describe('Select utils', () => {
    it('typeahead finds the next enabled match and wraps', () => {
        expect(typeaheadIndex(OPTIONS, 0, 'd')).toBe(1);
        expect(typeaheadIndex(OPTIONS, 0, 'f')).toBe(-1);
        expect(typeaheadIndex(OPTIONS, 3, 'e')).toBe(0);
    });
});

describe('Select', () => {
    it('shows the placeholder, then the selected label', () => {
        const { rerender } = render(<Select options={OPTIONS} aria-label="Language" />);
        expect(trigger().textContent).toContain('Select…');
        expect(trigger().getAttribute('aria-expanded')).toBe('false');
        rerender(<Select options={OPTIONS} aria-label="Language" defaultValue="de" />);
        expect(screen.getByRole('combobox', { name: 'Language' })).toBeDefined();
    });

    it('opens on click with sound, lists options and marks the selected one', () => {
        const sfx = makeSfx();
        render(
            <SfxContext.Provider value={sfx}>
                <Select options={OPTIONS} aria-label="Language" defaultValue="de" />
            </SfxContext.Provider>,
        );
        fireEvent.click(trigger());
        expect(trigger().getAttribute('aria-expanded')).toBe('true');
        expect(sfx.playOneShot).toHaveBeenCalledWith('menu_open');
        const list = screen.getByRole('listbox');
        expect(document.activeElement).toBe(list);
        expect(screen.getAllByRole('option')).toHaveLength(4);
        expect(screen.getByRole('option', { name: 'Deutsch' }).getAttribute('aria-selected')).toBe(
            'true',
        );
        expect(list.getAttribute('aria-activedescendant')).toBe(
            screen.getByRole('option', { name: 'Deutsch' }).id,
        );
    });

    it('picks an option with the pointer, reports it and closes', () => {
        const sfx = makeSfx();
        const onValueChange = vi.fn();
        render(
            <SfxContext.Provider value={sfx}>
                <Select options={OPTIONS} aria-label="Language" onValueChange={onValueChange} />
            </SfxContext.Provider>,
        );
        fireEvent.click(trigger());
        fireEvent.pointerUp(screen.getByRole('option', { name: 'Español' }), { button: 0 });
        expect(onValueChange).toHaveBeenCalledWith('es');
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(trigger().textContent).toContain('Español');
        expect(document.activeElement).toBe(trigger());
        expect(sfx.playOneShot).toHaveBeenCalledWith('menu_close');
    });

    it('keyboard: arrows skip disabled options, Enter selects', () => {
        const onValueChange = vi.fn();
        render(<Select options={OPTIONS} aria-label="Language" onValueChange={onValueChange} />);
        fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
        const list = screen.getByRole('listbox');
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'ArrowDown' });
        fireEvent.keyDown(list, { key: 'Enter' });
        expect(onValueChange).toHaveBeenCalledWith('es');
    });

    it('typeahead moves the active option', () => {
        render(<Select options={OPTIONS} aria-label="Language" />);
        fireEvent.click(trigger());
        const list = screen.getByRole('listbox');
        fireEvent.keyDown(list, { key: 'd' });
        expect(list.getAttribute('aria-activedescendant')).toBe(
            screen.getByRole('option', { name: 'Deutsch' }).id,
        );
    });

    it('Escape closes the list without letting the event through', () => {
        const outer = vi.fn();
        render(
            <div onKeyDown={outer} role="presentation">
                <Select options={OPTIONS} aria-label="Language" />
            </div>,
        );
        fireEvent.click(trigger());
        fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(document.activeElement).toBe(trigger());
        expect(outer).not.toHaveBeenCalled();
    });

    it('closes on a pointer down outside', () => {
        render(<Select options={OPTIONS} aria-label="Language" />);
        fireEvent.click(trigger());
        fireEvent.pointerDown(document.body);
        expect(screen.queryByRole('listbox')).toBeNull();
    });

    it('controlled: reports the value and keeps the prop', () => {
        const onValueChange = vi.fn();
        render(
            <Select
                options={OPTIONS}
                aria-label="Language"
                value="en"
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(trigger());
        fireEvent.pointerUp(screen.getByRole('option', { name: 'Deutsch' }), { button: 0 });
        expect(onValueChange).toHaveBeenCalledWith('de');
        expect(trigger().textContent).toContain('English');
    });

    it('disabled does not open; invalid sets aria-invalid; name adds a hidden input', () => {
        const { container } = render(
            <Select
                options={OPTIONS}
                aria-label="Language"
                disabled
                invalid
                name="lang"
                defaultValue="de"
            />,
        );
        fireEvent.click(trigger());
        expect(screen.queryByRole('listbox')).toBeNull();
        expect(trigger().getAttribute('aria-invalid')).toBe('true');
        expect(container.querySelector<HTMLInputElement>('input[name="lang"]')?.value).toBe('de');
    });
});
