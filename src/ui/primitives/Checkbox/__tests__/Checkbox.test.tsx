import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Checkbox } from '../Checkbox';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

function makeSfx(): SfxContextValue {
    return { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
}

describe('Checkbox', () => {
    it('renders a native checkbox named by its label', () => {
        render(<Checkbox label="Auto-scan" />);
        const box = screen.getByRole<HTMLInputElement>('checkbox', { name: 'Auto-scan' });
        expect(box.checked).toBe(false);
    });

    it('uncontrolled: toggles on click and plays click', () => {
        const sfx = makeSfx();
        const onCheckedChange = vi.fn();
        render(
            <SfxContext.Provider value={sfx}>
                <Checkbox label="Auto-scan" onCheckedChange={onCheckedChange} />
            </SfxContext.Provider>,
        );
        const box = screen.getByRole<HTMLInputElement>('checkbox');
        fireEvent.click(box);
        expect(box.checked).toBe(true);
        expect(onCheckedChange).toHaveBeenCalledWith(true);
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });

    it('defaultChecked starts checked', () => {
        render(<Checkbox label="Auto-scan" defaultChecked />);
        expect(screen.getByRole<HTMLInputElement>('checkbox').checked).toBe(true);
    });

    it('controlled: reports the next value and keeps the prop value', () => {
        const onCheckedChange = vi.fn();
        render(<Checkbox label="Auto-scan" checked={false} onCheckedChange={onCheckedChange} />);
        const box = screen.getByRole<HTMLInputElement>('checkbox');
        fireEvent.click(box);
        expect(onCheckedChange).toHaveBeenCalledWith(true);
        expect(box.checked).toBe(false);
    });

    it('sets the native indeterminate state', () => {
        render(<Checkbox label="All" indeterminate />);
        expect(screen.getByRole<HTMLInputElement>('checkbox').indeterminate).toBe(true);
    });

    it('disabled does not toggle', () => {
        const onCheckedChange = vi.fn();
        render(<Checkbox label="Auto-scan" disabled onCheckedChange={onCheckedChange} />);
        fireEvent.click(screen.getByRole('checkbox'));
        expect(onCheckedChange).not.toHaveBeenCalled();
    });

    it('forwards the ref to the input and className to the label', () => {
        const ref = createRef<HTMLInputElement>();
        const { container } = render(<Checkbox ref={ref} label="A" className="mt-2" />);
        expect(ref.current?.type).toBe('checkbox');
        expect(container.querySelector('label')?.className).toContain('mt-2');
    });
});
