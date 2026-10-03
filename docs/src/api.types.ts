/** Shape of docs/generated/api/<Name>.json. Shared by scripts/gen-api.ts, scripts/check-docs.ts and the docs site. */

export interface ApiProp {
    name: string;
    type: string;
    required: boolean;
    default: string | null;
    description: string;
}

export interface InheritedProps {
    /** Name of the external type the props come from, e.g. `ButtonHTMLAttributes`. */
    from: string;
    count: number;
}

export interface ApiDoc {
    name: string;
    slug: string;
    group: 'primitives' | 'compositions' | 'window' | 'orb';
    entry: 'jarvis-react-ui' | 'jarvis-react-ui/orb';
    /** Repo-relative source file. */
    file: string;
    description: string;
    props: ApiProp[];
    inherited: InheritedProps[];
}
