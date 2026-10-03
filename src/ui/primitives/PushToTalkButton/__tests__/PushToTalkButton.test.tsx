import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import React, { createRef } from 'react';
import { PushToTalkButton } from '../PushToTalkButton';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';
import type { SfxEvent } from '@core/audio';

type MockFn = ReturnType<typeof vi.fn> & ((event: SfxEvent) => void);

function makeSfx(): { playOneShot: MockFn; play: MockFn; stop: MockFn } & SfxContextValue {
    return { playOneShot: vi.fn() as MockFn, play: vi.fn() as MockFn, stop: vi.fn() as MockFn };
}

function renderWithSfx(sfx: SfxContextValue, ui: React.ReactElement) {
    return render(<SfxContext.Provider value={sfx}>{ui}</SfxContext.Provider>);
}

describe('PushToTalkButton — visual', () => {
    it('renders without crashing', () => {
        const { container } = render(<PushToTalkButton />);
        expect(container.querySelector('.lib-ptt')).toBeDefined();
    });

    it('renders a button element', () => {
        const { getByRole } = render(<PushToTalkButton />);
        expect(getByRole('button')).toBeDefined();
    });

    it('has default aria-label "Push to talk"', () => {
        const { getByRole } = render(<PushToTalkButton />);
        expect(getByRole('button').getAttribute('aria-label')).toBe('Push to talk');
    });

    it('uses the deprecated ariaLabel prop as accessible name', () => {
        const { getByRole } = render(<PushToTalkButton ariaLabel="Record audio" />);
        expect(getByRole('button', { name: 'Record audio' })).toBeDefined();
    });

    it('uses the standard aria-label attribute', () => {
        const { getByRole } = render(<PushToTalkButton aria-label="Hold to talk" />);
        expect(getByRole('button', { name: 'Hold to talk' })).toBeDefined();
    });

    it('prefers aria-label over the deprecated ariaLabel', () => {
        const { getByRole } = render(
            <PushToTalkButton aria-label="Standard" ariaLabel="Deprecated" />,
        );
        expect(getByRole('button').getAttribute('aria-label')).toBe('Standard');
    });

    it('forwards native button attributes', () => {
        const { getByRole } = render(
            <PushToTalkButton id="ptt" disabled data-testid="ptt-btn" title="Talk" />,
        );
        const btn = getByRole('button');
        expect(btn.getAttribute('id')).toBe('ptt');
        expect(btn.hasAttribute('disabled')).toBe(true);
        expect(btn.getAttribute('data-testid')).toBe('ptt-btn');
        expect(btn.getAttribute('title')).toBe('Talk');
        expect(btn.getAttribute('type')).toBe('button');
    });

    it('forwards the ref to the button element', () => {
        const ref = createRef<HTMLButtonElement>();
        render(<PushToTalkButton ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('has a displayName', () => {
        expect(PushToTalkButton.displayName).toBe('PushToTalkButton');
    });

    it('supports hold-to-talk via pointer down/up', () => {
        const onDown = vi.fn();
        const onUp = vi.fn();
        const { getByRole } = render(
            <PushToTalkButton onPointerDown={onDown} onPointerUp={onUp} />,
        );
        fireEvent.pointerDown(getByRole('button'));
        expect(onDown).toHaveBeenCalledOnce();
        expect(onUp).not.toHaveBeenCalled();
        fireEvent.pointerUp(getByRole('button'));
        expect(onUp).toHaveBeenCalledOnce();
    });

    it('lets aria-pressed be overridden', () => {
        const { getByRole } = render(<PushToTalkButton active aria-pressed={false} />);
        expect(getByRole('button').getAttribute('aria-pressed')).toBe('false');
    });

    it('does not have active class when active=false', () => {
        const { container } = render(<PushToTalkButton active={false} />);
        expect(container.querySelector('.lib-ptt')?.classList.contains('active')).toBe(false);
    });

    it('adds active class when active=true', () => {
        const { container } = render(<PushToTalkButton active />);
        expect(container.querySelector('.lib-ptt')?.classList.contains('active')).toBe(true);
    });

    it('sets aria-pressed based on active prop', () => {
        const { getByRole, rerender } = render(<PushToTalkButton active={false} />);
        expect(getByRole('button').getAttribute('aria-pressed')).toBe('false');
        rerender(<PushToTalkButton active />);
        expect(getByRole('button').getAttribute('aria-pressed')).toBe('true');
    });

    it('calls onClick with the click event', () => {
        const handler = vi.fn();
        const { getByRole } = render(<PushToTalkButton onClick={handler} />);
        fireEvent.click(getByRole('button'));
        expect(handler).toHaveBeenCalledOnce();
        expect(handler.mock.calls[0]?.[0]).toHaveProperty('type', 'click');
    });

    it('accepts a no-argument onClick handler', () => {
        let clicks = 0;
        const { getByRole } = render(
            <PushToTalkButton
                onClick={() => {
                    clicks += 1;
                }}
            />,
        );
        fireEvent.click(getByRole('button'));
        expect(clicks).toBe(1);
    });

    it('renders rim element', () => {
        const { container } = render(<PushToTalkButton />);
        expect(container.querySelector('.lib-ptt__rim')).toBeDefined();
    });

    it('renders children instead of default icon when provided', () => {
        const { getByText } = render(<PushToTalkButton>TALK</PushToTalkButton>);
        expect(getByText('TALK')).toBeDefined();
    });

    it('merges className', () => {
        const { container } = render(<PushToTalkButton className="extra" />);
        expect(container.querySelector('.lib-ptt')?.classList.contains('extra')).toBe(true);
    });

    it('has data-sfx-hover="button" attribute', () => {
        const { container } = render(<PushToTalkButton />);
        expect(container.querySelector('[data-sfx-hover="button"]')).not.toBeNull();
    });
});

describe('PushToTalkButton — SFX', () => {
    it('plays hover_button on mouseenter', () => {
        const sfx = makeSfx();
        const { getByRole } = renderWithSfx(sfx, <PushToTalkButton />);
        fireEvent.mouseEnter(getByRole('button'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
    });

    it('still calls a forwarded onMouseEnter alongside the hover sound', () => {
        const sfx = makeSfx();
        const onEnter = vi.fn();
        const { getByRole } = renderWithSfx(sfx, <PushToTalkButton onMouseEnter={onEnter} />);
        fireEvent.mouseEnter(getByRole('button'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('hover_button');
        expect(onEnter).toHaveBeenCalledOnce();
    });

    it('plays click on click', () => {
        const sfx = makeSfx();
        const { getByRole } = renderWithSfx(sfx, <PushToTalkButton />);
        fireEvent.click(getByRole('button'));
        expect(sfx.playOneShot).toHaveBeenCalledWith('click');
    });
});
