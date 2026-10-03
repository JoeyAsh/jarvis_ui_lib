import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Check, Copy } from 'lucide-react';
import { cx } from '@common/utils/cx';
import { IconButton } from '../../primitives/IconButton';
import { Tooltip } from '../../primitives/Tooltip';
import { COPIED_RESET_MS } from './constants';
import type { CodeBlockProps } from './CodeBlock.types';

export function CodeBlock({
    code,
    html,
    language,
    title,
    copyable = true,
    onCopy,
    actions,
    className,
}: CodeBlockProps): ReactElement {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        },
        [],
    );

    function handleCopy(): void {
        const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
        if (clipboard === undefined) return;
        clipboard.writeText(code).then(
            () => {
                setCopied(true);
                onCopy?.(code);
                if (timerRef.current !== null) clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
            },
            () => setCopied(false),
        );
    }

    const hasHeader =
        title !== undefined || language !== undefined || copyable || actions !== undefined;

    return (
        <div
            className={cx(
                'flex flex-col border border-border rounded-[2px] bg-[rgba(5,5,8,0.9)] font-mono',
                className,
            )}
        >
            {hasHeader && (
                <div className="flex items-center gap-[8px] min-h-[32px] pl-[12px] pr-[4px] border-b border-border">
                    {title !== undefined && (
                        <span className="text-[10px] text-text-secondary truncate">{title}</span>
                    )}
                    {language !== undefined && (
                        <span className="text-[9px] uppercase tracking-[1px] text-text-muted">
                            {language}
                        </span>
                    )}
                    <div className="ml-auto flex items-center gap-[2px]">
                        {actions}
                        {copyable && (
                            <Tooltip content={copied ? 'Copied' : 'Copy'} delayMs={0}>
                                <IconButton
                                    icon={copied ? Check : Copy}
                                    label={copied ? 'Copied' : 'Copy code'}
                                    size="sm"
                                    className={cx(copied && 'text-success hover:text-success')}
                                    onClick={handleCopy}
                                />
                            </Tooltip>
                        )}
                    </div>
                </div>
            )}
            <pre className="m-0 p-[12px] overflow-x-auto text-[11px] leading-[1.6] text-accent-bright">
                {html !== undefined ? (
                    <code dangerouslySetInnerHTML={{ __html: html }} />
                ) : (
                    <code>{code}</code>
                )}
            </pre>
        </div>
    );
}

export default CodeBlock;
