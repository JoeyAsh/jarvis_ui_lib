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

/** A public helper type that props refer to, e.g. `TabItem` or `AppOrbState`. */
export interface ApiType {
    /** Name with type parameters, e.g. `TableColumn<T>`. */
    name: string;
    description: string;
    /** Type text for unions and aliases (`'idle' | 'listening'`); null for object types. */
    definition: string | null;
    /** Fields of an object type (empty for unions and aliases). */
    fields: ApiProp[];
}

export interface ApiDoc {
    name: string;
    slug: string;
    group: 'primitives' | 'compositions' | 'window' | 'orb' | 'generative';
    entry: 'jarvis-react-ui' | 'jarvis-react-ui/orb' | 'jarvis-react-ui/generative';
    /** Repo-relative source file. */
    file: string;
    description: string;
    props: ApiProp[];
    inherited: InheritedProps[];
    /** Public helper types the props refer to, in order of first mention. */
    types: ApiType[];
}
