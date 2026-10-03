import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('CodeBlock', () => {
    it('renders raw code as text', () => {
        render(<CodeBlock code="<Button />" />);
        expect(screen.getByText('<Button />').tagName).toBe('CODE');
    });

    it('renders pre-highlighted html inside code', () => {
        const { container } = render(
            <CodeBlock code="x" html={'<span class="tok">highlighted</span>'} />,
        );
        expect(container.querySelector('code .tok')?.textContent).toBe('highlighted');
    });

    it('shows title and language in the header', () => {
        render(<CodeBlock code="x" title="Button.tsx" language="tsx" />);
        expect(screen.getByText('Button.tsx')).toBeDefined();
        expect(screen.getByText('tsx')).toBeDefined();
    });

    it('copyable=false hides the copy button and the header when empty', () => {
        const { container } = render(<CodeBlock code="x" copyable={false} />);
        expect(screen.queryByRole('button')).toBeNull();
        expect(container.querySelector('.border-b')).toBeNull();
    });

    it('copies the raw code and shows the copied state', async () => {
        vi.useFakeTimers();
        const writeText = vi.fn(() => Promise.resolve());
        vi.stubGlobal('navigator', { clipboard: { writeText } });
        render(<CodeBlock code="npm i jarvis-react-ui" />);
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
            await Promise.resolve();
        });
        expect(writeText).toHaveBeenCalledWith('npm i jarvis-react-ui');
        expect(screen.getByRole('button', { name: 'Copied' })).toBeDefined();
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(screen.getByRole('button', { name: 'Copy code' })).toBeDefined();
    });

    it('does nothing when the clipboard API is missing', () => {
        vi.stubGlobal('navigator', {});
        render(<CodeBlock code="x" />);
        fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
        expect(screen.getByRole('button', { name: 'Copy code' })).toBeDefined();
    });

    it('renders actions and merges className', () => {
        const { container } = render(
            <CodeBlock
                code="x"
                actions={<button type="button">expand</button>}
                className="extra"
            />,
        );
        expect(screen.getByRole('button', { name: 'expand' })).toBeDefined();
        expect(container.firstElementChild?.className).toContain('extra');
    });
});
