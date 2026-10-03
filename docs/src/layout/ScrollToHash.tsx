import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Scrolls to the `#hash` target once the lazily loaded page content is in the DOM. Render it next
 * to the page inside the same Suspense boundary, so its effect runs after the page mounted.
 */
export function ScrollToHash(): null {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (hash === '') {
            window.scrollTo({ top: 0 });
            return;
        }
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    }, [hash, pathname]);

    return null;
}

export default ScrollToHash;
