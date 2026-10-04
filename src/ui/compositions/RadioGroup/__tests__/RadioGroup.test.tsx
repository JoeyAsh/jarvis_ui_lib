import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from '../RadioGroup';
import type { RadioItem } from '../RadioGroup.types';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

const ITEMS: RadioItem[] = [
    { value: 'low', label: 'Low' },
    { value: 'mid', label: 'Mid', description: 'Balanced' },
    { value: 'off', label: 'Off', disabled: true },
    { value: 'high', label: 'High' },
];

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

function radio(name: string): HTMLElement {
    return screen.getByRole('radio', { name: new RegExp(`^${name}`) });
}

describe('RadioGroup', () => {
    it('renders a named radiogroup with one radio per item', () => {
        render(<RadioGroup items={ITEMS} aria-label="Quality" />);
        expect(screen.getByRole('radiogroup', { name: 'Quality' })).toBeDefined();
        expect(screen.getAllByRole('radio')).toHaveLength(4);
        expect(screen.getByText('Balanced')).toBeDefined();
    });

    it('uncontrolled: click selects and plays click', () => {
        const sfx = makeSfx();
        const onValueChange = vi.fn();
        render(
            <SfxContext.Provider value={sfx}>
                <RadioGroup items={ITEMS} aria-label="Quality" onValueChange={onValueChange} />
            </SfxContext.Provider>,
        );
        fireEvent.click(radio('Mid'));
        expect(radio('Mid').getAttribute('aria-checked')).toBe('true');
        expect(onValueChange).toHaveBeenCalledWith('mid');
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('has one tab stop: the selected radio, or the first enabled one', () => {
        const { unmount } = render(<RadioGroup items={ITEMS} aria-label="Quality" />);
        expect(radio('Low').getAttribute('tabindex')).toBe('0');
        expect(radio('Mid').getAttribute('tabindex')).toBe('-1');
        unmount();
        render(<RadioGroup items={ITEMS} aria-label="Quality" defaultValue="high" />);
        expect(radio('High').getAttribute('tabindex')).toBe('0');
        expect(radio('Low').getAttribute('tabindex')).toBe('-1');
    });

    it('arrow keys move the selection and skip disabled items', () => {
        const onValueChange = vi.fn();
        render(
            <RadioGroup
                items={ITEMS}
                aria-label="Quality"
                defaultValue="mid"
                onValueChange={onValueChange}
            />,
        );
        fireEvent.keyDown(radio('Mid'), { key: 'ArrowDown' });
        expect(onValueChange).toHaveBeenLastCalledWith('high');
        expect(document.activeElement).toBe(radio('High'));
        fireEvent.keyDown(radio('High'), { key: 'ArrowDown' });
        expect(onValueChange).toHaveBeenLastCalledWith('low');
        fireEvent.keyDown(radio('Low'), { key: 'End' });
        expect(onValueChange).toHaveBeenLastCalledWith('high');
    });

    it('controlled: reports the value and keeps the prop', () => {
        const onValueChange = vi.fn();
        render(
            <RadioGroup
                items={ITEMS}
                aria-label="Quality"
                value="low"
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(radio('High'));
        expect(onValueChange).toHaveBeenCalledWith('high');
        expect(radio('Low').getAttribute('aria-checked')).toBe('true');
    });

    it('disabled items and groups cannot be selected', () => {
        const onValueChange = vi.fn();
        const { rerender } = render(
            <RadioGroup items={ITEMS} aria-label="Quality" onValueChange={onValueChange} />,
        );
        fireEvent.click(radio('Off'));
        expect(onValueChange).not.toHaveBeenCalled();
        rerender(
            <RadioGroup
                items={ITEMS}
                aria-label="Quality"
                disabled
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(radio('Low'));
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it('sets the orientation and merges className', () => {
        render(
            <RadioGroup
                items={ITEMS}
                aria-label="Quality"
                orientation="horizontal"
                className="mt-2"
            />,
        );
        const group = screen.getByRole('radiogroup');
        expect(group.getAttribute('aria-orientation')).toBe('horizontal');
        expect(group.className).toContain('mt-2');
    });
});
