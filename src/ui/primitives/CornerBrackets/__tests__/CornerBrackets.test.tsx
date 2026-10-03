import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CornerBrackets } from '../CornerBrackets';

describe('CornerBrackets', () => {
    it('renders children', () => {
        render(
            <CornerBrackets>
                <span>inner</span>
            </CornerBrackets>,
        );
        expect(screen.getByText('inner')).toBeDefined();
    });

    it('renders 4 corner spans', () => {
        const { container } = render(
            <CornerBrackets>
                <div>x</div>
            </CornerBrackets>,
        );
        const spans = container.querySelectorAll('span[aria-hidden]');
        expect(spans.length).toBe(4);
    });

    it('unfocused corners use the accent color at 70% opacity', () => {
        const { container } = render(
            <CornerBrackets>
                <div>x</div>
            </CornerBrackets>,
        );
        container.querySelectorAll('span[aria-hidden]').forEach((span: Element) => {
            expect(span.classList.contains('opacity-70')).toBe(true);
            expect(span.classList.contains('border-accent')).toBe(true);
        });
    });

    it('focused corners use the bright accent at full opacity', () => {
        const { container } = render(
            <CornerBrackets focused>
                <div>x</div>
            </CornerBrackets>,
        );
        const span = container.querySelector('span[aria-hidden]');
        expect(span?.classList.contains('opacity-100')).toBe(true);
        expect(span?.classList.contains('border-accent-bright')).toBe(true);
    });

    it('injects the bracket size as a CSS variable instead of inline geometry', () => {
        const { container } = render(
            <CornerBrackets size={20}>
                <div>x</div>
            </CornerBrackets>,
        );
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--cb-size')).toBe('20px');
        container.querySelectorAll('span[aria-hidden]').forEach((span: Element) => {
            expect(span.getAttribute('style')).toBeNull();
        });
    });

    it('defaults the bracket size to 12px', () => {
        const { container } = render(
            <CornerBrackets>
                <div>x</div>
            </CornerBrackets>,
        );
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.style.getPropertyValue('--cb-size')).toBe('12px');
    });

    it('className merges on wrapper', () => {
        const { container } = render(
            <CornerBrackets className="extra">
                <div>x</div>
            </CornerBrackets>,
        );
        expect(container.querySelector('div')?.className).toContain('extra');
        expect(container.querySelector('div')?.className).toContain('relative');
    });
});
