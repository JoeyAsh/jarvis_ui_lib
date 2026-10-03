import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

afterEach(() => {
    vi.useRealTimers();
});

describe('Tooltip', () => {
    it('is hidden by default', () => {
        render(
            <Tooltip content="Copy">
                <button type="button">C</button>
            </Tooltip>,
        );
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('opens after the hover delay and closes on mouseleave', () => {
        vi.useFakeTimers();
        render(
            <Tooltip content="Copy" delayMs={200}>
                <button type="button">C</button>
            </Tooltip>,
        );
        const trigger = screen.getByRole('button');
        fireEvent.mouseEnter(trigger.parentElement ?? trigger);
        expect(screen.queryByRole('tooltip')).toBeNull();
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(screen.getByRole('tooltip').textContent).toContain('Copy');
        fireEvent.mouseLeave(trigger.parentElement ?? trigger);
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('opens immediately on focus and links the trigger via aria-describedby', () => {
        render(
            <Tooltip content="Copy code">
                <button type="button">C</button>
            </Tooltip>,
        );
        const trigger = screen.getByRole('button');
        fireEvent.focus(trigger);
        const tip = screen.getByRole('tooltip');
        expect(trigger.getAttribute('aria-describedby')).toBe(tip.id);
    });

    it('closes on Escape', () => {
        render(
            <Tooltip content="Copy">
                <button type="button">C</button>
            </Tooltip>,
        );
        const trigger = screen.getByRole('button');
        fireEvent.focus(trigger);
        fireEvent.keyDown(trigger, { key: 'Escape' });
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('disabled never shows', () => {
        render(
            <Tooltip content="Copy" disabled>
                <button type="button">C</button>
            </Tooltip>,
        );
        fireEvent.focus(screen.getByRole('button'));
        expect(screen.queryByRole('tooltip')).toBeNull();
    });

    it('applies placement and className to the bubble', () => {
        render(
            <Tooltip content="Copy" placement="bottom" className="tip-x">
                <button type="button">C</button>
            </Tooltip>,
        );
        fireEvent.focus(screen.getByRole('button'));
        const tip = screen.getByRole('tooltip');
        expect(tip.className).toContain('top-full');
        expect(tip.className).toContain('tip-x');
    });
});
