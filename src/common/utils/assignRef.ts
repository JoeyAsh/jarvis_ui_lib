import type { ForwardedRef } from 'react';

/** Writes `node` into a forwarded ref, whether it is a callback or an object ref. */
export function assignRef<T>(ref: ForwardedRef<T>, node: T | null): void {
    if (typeof ref === 'function') ref(node);
    else if (ref !== null) ref.current = node;
}
