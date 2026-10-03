import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import type { ApiDoc } from '../api.types';
import type { DemoSource } from './registry.types';

const demoModules = import.meta.glob<{ default: ComponentType }>('../demos/**/*.tsx');
const demoSources = import.meta.glob<DemoSource>('../demos/**/*.tsx', {
    query: '?highlight',
    import: 'default',
});
const apiModules = import.meta.glob<ApiDoc>('../../generated/api/*.json', { import: 'default' });

/** Every demo wrapped in `React.lazy` once, at module load (nothing is fetched until rendered). */
export const DEMOS: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
    Object.entries(demoModules).map(([key, load]) => [key, lazy(load)]),
);
const sourceCache = new Map<string, Promise<DemoSource>>();
const apiCache = new Map<string, Promise<ApiDoc>>();

export function demoKey(name: string): string {
    return `../demos/${name}.tsx`;
}

/** Whether a demo file `demos/<name>.tsx` exists. */
export function hasDemo(name: string): boolean {
    return demoKey(name) in demoModules;
}

/** Highlighted source of `demos/<name>.tsx` (cached promise, for `use()`). */
export function demoSource(name: string): Promise<DemoSource> {
    let source = sourceCache.get(name);
    if (source === undefined) {
        const load = demoSources[demoKey(name)];
        source = load ? load() : Promise.reject(new Error(`Unknown demo: ${name}`));
        sourceCache.set(name, source);
    }
    return source;
}

/** Generated API data for a component (cached promise, for `use()`). */
export function apiDoc(component: string): Promise<ApiDoc> {
    let doc = apiCache.get(component);
    if (doc === undefined) {
        const load = apiModules[`../../generated/api/${component}.json`];
        doc = load
            ? load()
            : Promise.reject(new Error(`No API data for ${component}. Run \`npm run docs:api\`.`));
        apiCache.set(component, doc);
    }
    return doc;
}
