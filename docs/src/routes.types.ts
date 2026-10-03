import type { ComponentType, LazyExoticComponent } from 'react';
import type { MDXComponents } from 'mdx/types';

export interface MdxContentProps {
    components?: MDXComponents;
}

export interface MdxModule {
    default: ComponentType<MdxContentProps>;
}

export interface PageRoute {
    slug: string;
    /** Lazily loaded MDX page component. */
    Page: LazyExoticComponent<ComponentType<MdxContentProps>>;
}
