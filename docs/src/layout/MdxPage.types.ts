import type { PageRoute } from '../routes.types';

export interface MdxPageProps {
    /** Route slug of the page. */
    slug: string;
    /** Lazily loaded page component. */
    Page: PageRoute['Page'];
}
