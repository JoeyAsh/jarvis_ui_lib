import { createContext, useContext } from 'react';
import type { ToastApi } from './ToastProvider.types';

export const ToastContext = createContext<ToastApi | null>(null);

/**
 * Shows notifications from anywhere below a `ToastProvider` (or `JarvisProvider`).
 *
 * @example
 * const { toast } = useToast();
 * toast({ variant: 'success', title: 'Saved', description: 'Profile updated.' });
 */
export function useToast(): ToastApi {
    const api = useContext(ToastContext);
    if (api === null) {
        throw new Error('useToast() must be used inside <ToastProvider> or <JarvisProvider>.');
    }
    return api;
}
