import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Hint } from '../Hint';

describe('Hint', () => {
    it('renders without crashing', () => {
        const { container } = render(<Hint>PUSH TO TALK</Hint>);
        expect(container.querySelector('.lib-hint')).toBeDefined();
    });

    it('defaults to the lib-hint--fixed-br modifier class', () => {
        const { container } = render(<Hint>hint</Hint>);
        const root = container.querySelector('.lib-hint');
        expect(root?.classList.contains('lib-hint--fixed-br')).toBe(true);
        expect(root?.classList.contains('fixed-br')).toBe(false);
    });

    it('position="fixed-br" maps to the BEM modifier', () => {
        const { container } = render(<Hint position="fixed-br">hint</Hint>);
        expect(container.querySelector('.lib-hint')?.className).toBe('lib-hint lib-hint--fixed-br');
    });

    it('applies inline class when position=inline', () => {
        const { container } = render(<Hint position="inline">hint</Hint>);
        expect(container.querySelector('.lib-hint')?.classList.contains('inline')).toBe(true);
        expect(container.querySelector('.lib-hint')?.classList.contains('lib-hint--fixed-br')).toBe(
            false,
        );
    });

    it('renders children text', () => {
        const { getByText } = render(<Hint>PUSH TO TALK</Hint>);
        expect(getByText('PUSH TO TALK')).toBeDefined();
    });

    it('merges className', () => {
        const { container } = render(<Hint className="extra">hint</Hint>);
        expect(container.querySelector('.lib-hint')?.classList.contains('extra')).toBe(true);
    });

    describe('Hint.Key', () => {
        it('renders as kbd element', () => {
            const { container } = render(
                <Hint>
                    <Hint.Key>SPACE</Hint.Key>
                </Hint>,
            );
            expect(container.querySelector('kbd.lib-hint__kbd')).not.toBeNull();
        });

        it('renders the Kbd primitive chip', () => {
            const { getByText } = render(<Hint.Key>SPACE</Hint.Key>);
            const kbd = getByText('SPACE');
            expect(kbd.tagName).toBe('KBD');
            expect(kbd.className).toContain('text-accent');
            expect(kbd.className).toContain('border-border');
            expect(kbd.className).toContain('lib-hint__kbd');
        });

        it('renders key text', () => {
            const { getByText } = render(
                <Hint>
                    <Hint.Key>CTRL+.</Hint.Key>
                </Hint>,
            );
            expect(getByText('CTRL+.')).toBeDefined();
        });

        it('merges className on Key', () => {
            const { container } = render(
                <Hint>
                    <Hint.Key className="key-extra">SPACE</Hint.Key>
                </Hint>,
            );
            expect(container.querySelector('kbd')?.classList.contains('key-extra')).toBe(true);
        });
    });
});
