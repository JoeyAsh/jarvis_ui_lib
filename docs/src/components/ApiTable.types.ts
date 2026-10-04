import type { ApiType } from '../api.types';

export interface ApiTableProps {
    /** Export name of the component, e.g. `Button`. */
    component: string;
}

export interface TypeDetailsProps {
    /** Helper type to describe. */
    type: ApiType;
}
