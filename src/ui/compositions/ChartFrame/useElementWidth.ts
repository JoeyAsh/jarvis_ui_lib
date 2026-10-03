import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { FALLBACK_WIDTH } from './constants';

/** Tracks the content width of an element with ResizeObserver (falls back to a fixed width). */
export function useElementWidth<T extends HTMLElement>(): [RefObject<T | null>, number] {
    const ref = useRef<T>(null);
    const [width, setWidth] = useState(FALLBACK_WIDTH);

    useLayoutEffect(() => {
        const el = ref.current;
        if (el === null) return undefined;
        const measure = (): void => {
            const w = el.clientWidth;
            if (w > 0) setWidth(w);
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return [ref, width];
}
