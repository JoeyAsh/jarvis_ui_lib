import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { Textarea } from '../Textarea';
import { autoHeight } from '../utils';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Textarea', () => {
    it('renders a textbox with rows and placeholder', () => {
        render(<Textarea aria-label="Notes" placeholder="Type…" />);
        const field = screen.getByRole('textbox', { name: 'Notes' });
        expect(field.getAttribute('rows')).toBe('3');
        expect(field.getAttribute('placeholder')).toBe('Type…');
    });

    it('marks invalid fields', () => {
        render(<Textarea aria-label="Notes" invalid />);
        expect(screen.getByRole('textbox').getAttribute('aria-invalid')).toBe('true');
    });

    it('calls onChange and forwards the ref', () => {
        const onChange = vi.fn();
        const ref = createRef<HTMLTextAreaElement>();
        render(<Textarea ref={ref} aria-label="Notes" onChange={onChange} />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(ref.current?.value).toBe('hi');
    });

    it('autoResize sets the height from the content, within rows and maxRows', () => {
        vi.spyOn(HTMLTextAreaElement.prototype, 'scrollHeight', 'get').mockReturnValue(500);
        render(<Textarea aria-label="Notes" autoResize rows={2} maxRows={4} />);
        const field = screen.getByRole('textbox');
        fireEvent.change(field, { target: { value: 'a\nb\nc\nd\ne\nf' } });
        expect(field.style.getPropertyValue('--textarea-h')).toBe(
            `${autoHeight(500, 2, 4, 'md')}px`,
        );
        expect(autoHeight(500, 2, 4, 'md')).toBe(4 * 17 + 18);
        expect(autoHeight(10, 2, 4, 'md')).toBe(2 * 17 + 18);
    });

    it('merges className and supports fullWidth', () => {
        render(<Textarea aria-label="Notes" fullWidth className="mt-2" />);
        const cls = screen.getByRole('textbox').className;
        expect(cls).toContain('w-full');
        expect(cls).toContain('mt-2');
    });
});
