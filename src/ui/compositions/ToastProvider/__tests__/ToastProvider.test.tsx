import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { ToastProvider } from '../ToastProvider';
import { useToast } from '../toastContext';
import type { ToastApi, ToastProviderProps } from '../ToastProvider.types';
import { SfxContext } from '@core/audio';
import type { SfxContextValue } from '@core/audio';

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

let api: ToastApi | null = null;

function captureApi(next: ToastApi): void {
    api = next;
}

function Capture({ onApi = captureApi }: { onApi?: (api: ToastApi) => void }): null {
    const toastApi = useToast();
    useEffect(() => onApi(toastApi), [onApi, toastApi]);
    return null;
}

function getApi(): ToastApi {
    if (api === null) throw new Error('ToastApi not captured');
    return api;
}

function renderProvider(props: Partial<ToastProviderProps> = {}, sfx?: SfxContextValue) {
    const tree: ReactElement = (
        <ToastProvider {...props}>
            <Capture />
        </ToastProvider>
    );
    return render(sfx ? <SfxContext.Provider value={sfx}>{tree}</SfxContext.Provider> : tree);
}

describe('ToastProvider + useToast', () => {
    it('useToast throws outside a provider', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        expect(() => render(<Capture />)).toThrow(/ToastProvider/);
    });

    it('renders a labelled live region', () => {
        renderProvider({ label: 'Alerts' });
        const region = screen.getByRole('region', { name: 'Alerts' });
        expect(region.getAttribute('aria-live')).toBe('polite');
    });

    it('toast() shows a toast and returns its id; dismiss() removes it', () => {
        renderProvider();
        let id = '';
        act(() => {
            id = getApi().toast({ title: 'Saved' });
        });
        expect(screen.getByRole('status').textContent).toContain('Saved');
        act(() => getApi().dismiss(id));
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('auto-dismisses after the duration', () => {
        vi.useFakeTimers();
        renderProvider({ duration: 1000 });
        act(() => {
            getApi().toast({ title: 'Saved' });
        });
        act(() => {
            vi.advanceTimersByTime(999);
        });
        expect(screen.queryByRole('status')).not.toBeNull();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('pauses while hovered and resumes with the remaining time', () => {
        vi.useFakeTimers();
        renderProvider({ duration: 1000 });
        act(() => {
            getApi().toast({ title: 'Saved' });
        });
        act(() => {
            vi.advanceTimersByTime(600);
        });
        fireEvent.mouseEnter(screen.getByRole('status'));
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(screen.queryByRole('status')).not.toBeNull();
        fireEvent.mouseLeave(screen.getByRole('status'));
        act(() => {
            vi.advanceTimersByTime(400);
        });
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('duration=Infinity stays until dismissed', () => {
        vi.useFakeTimers();
        renderProvider();
        act(() => {
            getApi().toast({ title: 'Sticky', duration: Infinity });
        });
        act(() => {
            vi.advanceTimersByTime(60_000);
        });
        expect(screen.queryByRole('status')).not.toBeNull();
    });

    it('shows at most `max` toasts and promotes queued ones', () => {
        renderProvider({ max: 2 });
        let first = '';
        act(() => {
            first = getApi().toast({ title: 'One' });
            getApi().toast({ title: 'Two' });
            getApi().toast({ title: 'Three' });
        });
        expect(screen.getAllByRole('status')).toHaveLength(2);
        expect(screen.queryByText('Three')).toBeNull();
        act(() => getApi().dismiss(first));
        expect(screen.getByText('Three')).toBeDefined();
    });

    it('reusing an id replaces the toast instead of stacking', () => {
        renderProvider();
        act(() => {
            getApi().toast({ id: 'copy', title: 'Copied' });
            getApi().toast({ id: 'copy', title: 'Copied again' });
        });
        expect(screen.getAllByRole('status')).toHaveLength(1);
        expect(screen.getByText('Copied again')).toBeDefined();
    });

    it('dismissAll() clears everything', () => {
        renderProvider();
        act(() => {
            getApi().toast({ title: 'One' });
            getApi().toast({ title: 'Two' });
        });
        act(() => getApi().dismissAll());
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('close button and Escape dismiss a toast', () => {
        renderProvider();
        act(() => {
            getApi().toast({ title: 'One' });
        });
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
        expect(screen.queryByRole('status')).toBeNull();
        act(() => {
            getApi().toast({ title: 'Two' });
        });
        fireEvent.keyDown(screen.getByRole('status'), { key: 'Escape' });
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('an action runs its handler and closes the toast', () => {
        const onClick = vi.fn();
        renderProvider();
        act(() => {
            getApi().toast({ title: 'Deleted', action: { label: 'Undo', onClick } });
        });
        fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('status')).toBeNull();
    });

    it('plays confirm for success and error for error toasts', () => {
        const sfx: SfxContextValue = { playOneShot: vi.fn(), play: vi.fn(), stop: vi.fn() };
        renderProvider({}, sfx);
        act(() => {
            getApi().toast({ variant: 'success', title: 'Saved' });
            getApi().toast({ variant: 'error', title: 'Failed' });
        });
        expect(sfx.playOneShot).toHaveBeenCalledWith('confirm');
        expect(sfx.playOneShot).toHaveBeenCalledWith('error');
    });

    it('applies the placement classes', () => {
        renderProvider({ placement: 'top-center' });
        expect(screen.getByRole('region').className).toContain('top-4');
    });
});
