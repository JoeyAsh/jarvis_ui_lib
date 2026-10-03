import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
    it('renders title and description with role=status', () => {
        render(<Toast title="Saved" description="Profile updated." />);
        const toast = screen.getByRole('status');
        expect(toast.textContent).toContain('Saved');
        expect(toast.textContent).toContain('Profile updated.');
    });

    it('variant=error uses role=alert', () => {
        render(<Toast variant="error" title="Failed" />);
        expect(screen.getByRole('alert')).toBeDefined();
    });

    it.each([
        ['info', 'border-l-accent'],
        ['success', 'border-l-success'],
        ['warning', 'border-l-warning'],
        ['error', 'border-l-error'],
    ] as const)('variant=%s uses %s', (variant, cls) => {
        const { container } = render(<Toast variant={variant} title="x" />);
        expect(container.firstElementChild?.className).toContain(cls);
    });

    it('shows a close button only with onDismiss', () => {
        const onDismiss = vi.fn();
        const { rerender } = render(<Toast title="x" />);
        expect(screen.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
        rerender(<Toast title="x" onDismiss={onDismiss} />);
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('renders an action button', () => {
        const onClick = vi.fn();
        render(<Toast title="Deleted" action={{ label: 'Undo', onClick }} />);
        fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('draws a countdown bar for finite durations, paused when asked', () => {
        const { container, rerender } = render(<Toast title="x" duration={3000} />);
        const bar = container.querySelector('[aria-hidden="true"].origin-left');
        expect(bar?.getAttribute('style')).toContain('--toast-duration: 3000ms');
        rerender(<Toast title="x" duration={3000} paused />);
        expect(container.querySelector('[aria-hidden="true"].origin-left')?.className).toContain(
            '[animation-play-state:paused]',
        );
    });

    it('draws no bar without a finite duration', () => {
        const { container } = render(<Toast title="x" duration={Infinity} />);
        expect(container.querySelector('.origin-left')).toBeNull();
    });

    it('merges className and forwards DOM props', () => {
        const onMouseEnter = vi.fn();
        const { container } = render(
            <Toast title="x" className="extra" onMouseEnter={onMouseEnter} />,
        );
        const root = container.firstElementChild;
        expect(root?.className).toContain('extra');
        if (root) fireEvent.mouseEnter(root);
        expect(onMouseEnter).toHaveBeenCalledTimes(1);
    });
});
