/// <reference types="vite/client" />

/** Build-time demo source (see docs/plugins/demoSource.ts). */
declare module '*?highlight' {
    const source: { code: string; html: string };
    export default source;
}

declare module 'virtual:search-index' {
    import type { SearchDoc } from '@docs/search.types';
    const docs: SearchDoc[];
    export default docs;
}

declare module '*.md' {
    import type { ComponentType } from 'react';
    import type { MDXComponents } from 'mdx/types';
    const MDXContent: ComponentType<{ components?: MDXComponents }>;
    export default MDXContent;
}
