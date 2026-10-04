import { useState } from 'react';
import type { CSSProperties, ReactElement } from 'react';
import { ExternalLink, Globe, RotateCw, TriangleAlert } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { IconButton } from '../../primitives/IconButton';
import { DEFAULT_SANDBOX } from './constants';
import { displayUrl, parseHttpUrl } from './utils';
import type { WebFrameProps } from './WebFrame.types';

/**
 * Shows a web page in an iframe with a small toolbar: address, reload and "open in new tab". Many
 * sites forbid being embedded; the new-tab button is the way out for those.
 */
export function WebFrame({
    url,
    title,
    sandbox = DEFAULT_SANDBOX,
    allow,
    toolbar = true,
    height,
    onLoad,
    className,
}: WebFrameProps): ReactElement {
    const parsed = parseHttpUrl(url);
    // Changing the key remounts the iframe, which reloads cross-origin pages too.
    const [reloadKey, setReloadKey] = useState(0);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);
    const frameKey = `${url}#${reloadKey}`;
    const loading = parsed !== null && loadedKey !== frameKey;
    const name = title ?? parsed?.host ?? url;

    return (
        <div
            style={
                height !== undefined
                    ? ({ '--webframe-h': `${height}px` } as CSSProperties)
                    : undefined
            }
            className={cx(
                'flex flex-col w-full min-h-[120px] font-mono border border-border rounded-[2px]',
                height !== undefined ? 'h-[var(--webframe-h)]' : 'h-full',
                'bg-[rgba(13,13,20,0.75)] overflow-hidden',
                className,
            )}
        >
            {toolbar && (
                <div className="flex items-center gap-[6px] h-[30px] px-[6px] border-b border-border shrink-0">
                    <Globe size={12} aria-hidden="true" className="shrink-0 text-text-secondary" />
                    <span
                        className="flex-1 min-w-0 truncate text-[10px] text-text-secondary"
                        title={url}
                    >
                        {parsed !== null ? displayUrl(parsed) : url}
                    </span>
                    {loading && (
                        <span className="shrink-0 text-[9px] uppercase tracking-[1px] text-accent animate-pulse motion-reduce:animate-none">
                            Loading
                        </span>
                    )}
                    <IconButton
                        icon={RotateCw}
                        label="Reload"
                        size="sm"
                        disabled={parsed === null}
                        onClick={() => setReloadKey((k) => k + 1)}
                    />
                    <IconButton
                        icon={ExternalLink}
                        label="Open in new tab"
                        size="sm"
                        disabled={parsed === null}
                        onClick={() => {
                            if (parsed !== null)
                                window.open(parsed.href, '_blank', 'noopener,noreferrer');
                        }}
                    />
                </div>
            )}
            {parsed !== null ? (
                <iframe
                    key={frameKey}
                    src={parsed.href}
                    title={name}
                    sandbox={sandbox}
                    allow={allow}
                    referrerPolicy="strict-origin-when-cross-origin"
                    loading="lazy"
                    onLoad={() => {
                        setLoadedKey(frameKey);
                        onLoad?.();
                    }}
                    className="block flex-1 w-full min-h-0 border-0 bg-transparent"
                />
            ) : (
                <div
                    role="alert"
                    className="flex flex-1 items-center justify-center gap-[6px] p-[12px] text-[10px] uppercase tracking-[1px] text-error"
                >
                    <TriangleAlert size={12} aria-hidden="true" />
                    Only http(s) addresses can be shown
                </div>
            )}
        </div>
    );
}

export default WebFrame;
