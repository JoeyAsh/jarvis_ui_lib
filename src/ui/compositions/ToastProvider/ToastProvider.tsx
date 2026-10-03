import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { cx } from '@common/utils/cx';
import { ToastContext } from './toastContext';
import { ToastItem } from './ToastItem';
import { DEFAULT_TOAST_DURATION_MS, DEFAULT_TOAST_MAX } from './constants';
import type {
    ToastApi,
    ToastOptions,
    ToastProviderProps,
    ToastRecord,
} from './ToastProvider.types';

const PLACEMENT_CLASSES = {
    'bottom-right': 'bottom-4 right-4 items-end flex-col-reverse',
    'top-right': 'top-4 right-4 items-end flex-col',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center flex-col',
} as const;

/**
 * Provides `useToast()` and renders the toast stack. Toasts beyond `max` wait in a queue and
 * appear as soon as a visible one closes.
 */
export function ToastProvider({
    children,
    placement = 'bottom-right',
    max = DEFAULT_TOAST_MAX,
    duration = DEFAULT_TOAST_DURATION_MS,
    label = 'Notifications',
}: ToastProviderProps): ReactElement {
    const [toasts, setToasts] = useState<ToastRecord[]>([]);
    const counterRef = useRef(0);

    const dismiss = useCallback((id: string) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const dismissAll = useCallback(() => setToasts([]), []);

    const toast = useCallback((options: ToastOptions): string => {
        counterRef.current += 1;
        const id = options.id ?? `toast-${counterRef.current}`;
        const version = counterRef.current;
        setToasts((list) => {
            const index = list.findIndex((t) => t.id === id);
            if (index === -1) return [...list, { ...options, id, version }];
            const next = [...list];
            next[index] = { ...options, id, version };
            return next;
        });
        return id;
    }, []);

    const api = useMemo<ToastApi>(
        () => ({ toast, dismiss, dismissAll }),
        [toast, dismiss, dismissAll],
    );
    const visible = toasts.slice(0, Math.max(1, max));

    return (
        <ToastContext.Provider value={api}>
            {children}
            <section
                aria-label={label}
                aria-live="polite"
                className={cx(
                    'fixed z-modal flex gap-2 pointer-events-none',
                    'w-[min(360px,calc(100vw-32px))]',
                    PLACEMENT_CLASSES[placement],
                )}
            >
                {visible.map((record) => (
                    <div
                        key={`${record.id}-${record.version}`}
                        className="pointer-events-auto w-full"
                    >
                        <ToastItem record={record} defaultDuration={duration} onDismiss={dismiss} />
                    </div>
                ))}
            </section>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
