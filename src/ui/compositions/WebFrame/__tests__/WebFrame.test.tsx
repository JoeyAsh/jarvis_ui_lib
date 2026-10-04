import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WebFrame } from '../WebFrame';
import { displayUrl, parseHttpUrl } from '../utils';

afterEach(() => {
    vi.restoreAllMocks();
});

function frame(container: HTMLElement): HTMLIFrameElement {
    const el = container.querySelector('iframe');
    if (el === null) throw new Error('no iframe');
    return el;
}

describe('WebFrame utils', () => {
    it('accepts only http(s) URLs', () => {
        expect(parseHttpUrl('https://example.com/a')?.host).toBe('example.com');
        expect(parseHttpUrl('javascript:alert(1)')).toBeNull();
        expect(parseHttpUrl('file:///etc/passwd')).toBeNull();
        expect(parseHttpUrl('not a url')).toBeNull();
    });

    it('shortens URLs for the toolbar', () => {
        expect(displayUrl(new URL('https://example.com/'))).toBe('example.com');
        expect(displayUrl(new URL('https://example.com/docs?q=1'))).toBe('example.com/docs?q=1');
    });
});

describe('WebFrame', () => {
    it('embeds the page in a sandboxed iframe named by the title or host', () => {
        const { container } = render(<WebFrame url="https://example.com/docs" />);
        const iframe = frame(container);
        expect(iframe.getAttribute('src')).toBe('https://example.com/docs');
        expect(iframe.getAttribute('title')).toBe('example.com');
        expect(iframe.getAttribute('sandbox')).toBe(
            'allow-scripts allow-same-origin allow-forms allow-popups',
        );
        expect(screen.getByText('example.com/docs')).toBeDefined();
    });

    it('shows loading until the page loads, then calls onLoad', () => {
        const onLoad = vi.fn();
        const { container } = render(
            <WebFrame url="https://example.com" title="Example" onLoad={onLoad} />,
        );
        expect(screen.getByText('Loading')).toBeDefined();
        fireEvent.load(frame(container));
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Loading')).toBeNull();
        expect(frame(container).getAttribute('title')).toBe('Example');
    });

    it('reload remounts the iframe', () => {
        const { container } = render(<WebFrame url="https://example.com" />);
        const first = frame(container);
        fireEvent.load(first);
        fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
        expect(frame(container)).not.toBe(first);
        expect(screen.getByText('Loading')).toBeDefined();
    });

    it('opens the page in a new tab without opener', () => {
        const open = vi.spyOn(window, 'open').mockReturnValue(null);
        render(<WebFrame url="https://example.com/x" />);
        fireEvent.click(screen.getByRole('button', { name: 'Open in new tab' }));
        expect(open).toHaveBeenCalledWith('https://example.com/x', '_blank', 'noopener,noreferrer');
    });

    it('refuses non-http URLs and disables the toolbar buttons', () => {
        const { container } = render(<WebFrame url="javascript:alert(1)" />);
        expect(container.querySelector('iframe')).toBeNull();
        expect(screen.getByRole('alert').textContent).toContain('Only http(s)');
        expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Reload' }).disabled).toBe(
            true,
        );
    });

    it('hides the toolbar and passes allow, sandbox and className', () => {
        const { container } = render(
            <WebFrame
                url="https://example.com"
                toolbar={false}
                sandbox=""
                allow="fullscreen"
                className="mt-2"
                height={300}
            />,
        );
        expect(screen.queryByRole('button', { name: 'Reload' })).toBeNull();
        expect(frame(container).getAttribute('sandbox')).toBe('');
        expect(frame(container).getAttribute('allow')).toBe('fullscreen');
        const rootEl = container.firstElementChild as HTMLElement;
        expect(rootEl.className).toContain('mt-2');
        expect(rootEl.className).toContain('h-[var(--webframe-h)]');
        expect(rootEl.className).not.toContain('h-full');
        expect(rootEl.style.getPropertyValue('--webframe-h')).toBe('300px');
    });
});
