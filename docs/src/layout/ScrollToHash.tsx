import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { HASH_SETTLE_MS } from './constants';

/**
 * Scrolls to the `#hash` target once the lazily loaded page content is in the DOM, and keeps it in
 * place while demos above it finish loading and change the layout (until the user scrolls or
 * `HASH_SETTLE_MS` passes). Render it next to the page inside the same Suspense boundary.
 */
export function ScrollToHash(): null {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (hash === '') {
            window.scrollTo({ top: 0 });
            return undefined;
        }
        const id = decodeURIComponent(hash.slice(1));
        const scroll = (): void => document.getElementById(id)?.scrollIntoView();
        scroll();

        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(scroll);
        observer.observe(document.body);
        const stop = (): void => observer.disconnect();
        const timer = setTimeout(stop, HASH_SETTLE_MS);
        const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
        userEvents.forEach((type) => window.addEventListener(type, stop, { once: true }));

        return () => {
            stop();
            clearTimeout(timer);
            userEvents.forEach((type) => window.removeEventListener(type, stop));
        };
    }, [hash, pathname]);

    return null;
}

export default ScrollToHash;
