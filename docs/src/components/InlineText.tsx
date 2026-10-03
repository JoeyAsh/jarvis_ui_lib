import type { ReactElement } from 'react';
import { splitInlineCode } from '../utils/text';
import type { InlineTextProps } from './InlineText.types';

/** Renders text whose `backticked` parts become inline code (for JSDoc descriptions). */
export function InlineText({ text }: InlineTextProps): ReactElement {
    return (
        <>
            {splitInlineCode(text).map((part, i) =>
                part.code ? (
                    <code
                        key={i}
                        className="px-[4px] py-[1px] rounded-[2px] bg-surface-raised text-accent-bright text-[10px]"
                    >
                        {part.text}
                    </code>
                ) : (
                    <span key={i}>{part.text}</span>
                ),
            )}
        </>
    );
}

export default InlineText;
