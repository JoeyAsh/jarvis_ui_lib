import { use } from 'react';
import type { ReactElement } from 'react';
import { CodeBlock } from '@ui';
import { demoSource } from '../utils/registry';
import type { DemoCodeProps } from './DemoCode.types';

export function DemoCode({ name }: DemoCodeProps): ReactElement {
    const source = use(demoSource(name));
    return (
        <CodeBlock
            className="border-0 border-t rounded-none"
            language="tsx"
            code={source.code}
            html={source.html}
        />
    );
}

export default DemoCode;
