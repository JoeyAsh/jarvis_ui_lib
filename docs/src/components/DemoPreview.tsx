import type { ReactElement } from 'react';
import { DEMOS, demoKey } from '../utils/registry';
import type { DemoCodeProps } from './DemoCode.types';

/** Renders the live demo component for `name` (must be wrapped in Suspense). */
export function DemoPreview({ name }: DemoCodeProps): ReactElement | null {
    const Preview = DEMOS[demoKey(name)];
    return Preview === undefined ? null : <Preview />;
}

export default DemoPreview;
