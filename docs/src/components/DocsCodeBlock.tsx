import type { ReactElement } from 'react';
import { CodeBlock, useToast } from '@ui';
import type { CodeBlockProps } from '@ui';

/** `CodeBlock` that confirms a copy with a toast (one reused toast, so repeated copies don't stack). */
export function DocsCodeBlock(props: CodeBlockProps): ReactElement {
    const { toast } = useToast();
    return (
        <CodeBlock
            {...props}
            onCopy={() =>
                toast({
                    id: 'docs-copied',
                    variant: 'success',
                    title: 'Copied to clipboard',
                    duration: 2000,
                })
            }
        />
    );
}

export default DocsCodeBlock;
