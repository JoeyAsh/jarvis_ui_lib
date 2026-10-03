import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd } from '../Kbd';

describe('Kbd', () => {
    it('renders a kbd element with its content', () => {
        render(<Kbd>Ctrl K</Kbd>);
        expect(screen.getByText('Ctrl K').tagName).toBe('KBD');
    });

    it('size=md uses the larger text', () => {
        render(<Kbd size="md">Esc</Kbd>);
        expect(screen.getByText('Esc').className).toContain('text-[11px]');
    });

    it('merges className and forwards attributes', () => {
        render(
            <Kbd className="extra" title="Command key">
                Cmd
            </Kbd>,
        );
        const kbd = screen.getByText('Cmd');
        expect(kbd.className).toContain('extra');
        expect(kbd.getAttribute('title')).toBe('Command key');
    });
});
