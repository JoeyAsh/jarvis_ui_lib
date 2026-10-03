import { useState } from 'react';
import { WrapText } from 'lucide-react';
import { CodeBlock, IconButton } from '@ui';

const SOURCE = `const status = await fetch('/api/reactor/status').then((res) => res.json()); // a deliberately long line`;

export default function WithActions() {
    const [wrap, setWrap] = useState(false);

    return (
        <CodeBlock
            className={wrap ? '[&_pre]:whitespace-pre-wrap' : undefined}
            title="status.ts"
            language="ts"
            code={SOURCE}
            actions={
                <IconButton
                    icon={WrapText}
                    label={wrap ? 'Disable line wrap' : 'Enable line wrap'}
                    size="sm"
                    aria-pressed={wrap}
                    onClick={() => setWrap((w) => !w)}
                />
            }
        />
    );
}
