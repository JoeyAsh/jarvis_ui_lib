import { use } from 'react';
import type { ReactElement } from 'react';
import { CodeBlock, Link, Pill } from '@ui';
import { apiDoc } from '../utils/registry';
import { sourceUrl } from '../utils/paths';
import type { ComponentMetaProps } from './ComponentMeta.types';

export function ComponentMetaContent({ component }: ComponentMetaProps): ReactElement {
    const doc = use(apiDoc(component));
    const statement = `import { ${doc.name} } from '${doc.entry}';`;
    const folder = doc.file.replace(/\/[^/]+$/, '');

    return (
        <div className="my-6 flex flex-col gap-3">
            <CodeBlock code={statement} language="ts" />
            <div className="flex flex-wrap items-center gap-4 text-[10px]">
                <Pill>{doc.group}</Pill>
                <Link href={sourceUrl(doc.file)} external variant="muted">
                    Source
                </Link>
                <Link href={sourceUrl(`${folder}/__tests__`)} external variant="muted">
                    Tests
                </Link>
                <Link href="#api" variant="muted">
                    API
                </Link>
            </div>
        </div>
    );
}

export default ComponentMetaContent;
