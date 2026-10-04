import type { ReactElement } from 'react';
import { TriangleAlert } from 'lucide-react';
import type { UiInvalidProps } from './UiRenderer.types';

/** Stands in for a node the renderer cannot render, so the rest of the window still works. */
export function UiInvalid({ message }: UiInvalidProps): ReactElement {
    return (
        <span
            role="note"
            className="inline-flex items-center gap-[6px] px-[6px] py-[2px] border border-dashed border-error rounded-[2px] text-[10px] text-error font-mono"
        >
            <TriangleAlert size={11} aria-hidden="true" />
            {message}
        </span>
    );
}

export default UiInvalid;
