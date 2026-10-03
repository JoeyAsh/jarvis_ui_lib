import { Suspense, useState } from 'react';
import type { ReactElement } from 'react';
import { Code } from 'lucide-react';
import { Callout, GridBackground, IconButton, Link, Tooltip } from '@ui';
import { cx } from '@common/utils/cx';
import { DemoPreview } from './DemoPreview';
import { hasDemo } from '../utils/registry';
import { sourceUrl } from '../utils/paths';
import { DemoCode } from './DemoCode';
import { DemoLoading } from './DemoLoading';
import type { DemoProps } from './Demo.types';

const ALIGN_CLASSES = {
    center: 'items-center justify-center',
    start: 'items-start justify-start',
    stretch: 'items-stretch justify-center',
} as const;

const HEIGHT_CLASSES = {
    auto: 'min-h-[140px]',
    tall: 'h-[420px]',
} as const;

/**
 * Live demo from `docs/src/demos/<name>.tsx`: renders the component on a HUD background and
 * reveals its exact source on demand.
 */
export function Demo({
    name,
    align = 'center',
    height = 'auto',
    defaultExpanded = false,
}: DemoProps): ReactElement {
    const [expanded, setExpanded] = useState(defaultExpanded);
    if (!hasDemo(name)) {
        return (
            <Callout variant="error" title="Missing demo">
                No file at docs/src/demos/{name}.tsx
            </Callout>
        );
    }

    return (
        <div className="my-6 flex flex-col border border-border rounded-[2px] bg-[rgba(13,13,20,0.6)]">
            <div
                className={cx(
                    'relative overflow-hidden transform-gpu flex flex-wrap gap-4 p-6 sm:p-8',
                    ALIGN_CLASSES[align],
                    HEIGHT_CLASSES[height],
                )}
            >
                <GridBackground />
                <div className={cx('relative flex w-full flex-wrap gap-4', ALIGN_CLASSES[align])}>
                    <Suspense fallback={<DemoLoading />}>
                        <DemoPreview name={name} />
                    </Suspense>
                </div>
            </div>
            <div className="flex items-center gap-2 border-t border-border px-3 py-[4px]">
                <span className="text-[9px] uppercase tracking-[1px] text-text-muted truncate">
                    {name}.tsx
                </span>
                <div className="ml-auto flex items-center gap-3">
                    <Link
                        href={sourceUrl(`docs/src/demos/${name}.tsx`)}
                        external
                        variant="muted"
                        className="text-[10px]"
                    >
                        Source
                    </Link>
                    <Tooltip content={expanded ? 'Hide code' : 'Show code'}>
                        <IconButton
                            icon={Code}
                            label={expanded ? 'Hide code' : 'Show code'}
                            size="sm"
                            pressed={expanded}
                            onClick={() => setExpanded((v) => !v)}
                        />
                    </Tooltip>
                </div>
            </div>
            {expanded && (
                <Suspense fallback={<DemoLoading />}>
                    <DemoCode name={name} />
                </Suspense>
            )}
        </div>
    );
}

export default Demo;
