import { lazy } from 'react';
import { slugFromPageKey } from './utils/paths';
import type { MdxModule, PageRoute } from './routes.types';

const pageModules = import.meta.glob<MdxModule>('./pages/**/*.mdx');

/** One lazily loaded route per MDX file under `pages/`. */
export const PAGE_ROUTES: PageRoute[] = Object.entries(pageModules).map(([key, load]) => ({
    slug: slugFromPageKey(key),
    Page: lazy(load),
}));
