/**
 * Extracts the API reference of every public component from its TypeScript props (types + JSDoc)
 * with react-docgen-typescript. Used by gen-api.ts (docs site) and gen-llms.ts (npm package).
 */
import { join } from 'node:path';
import { withCustomConfig } from 'react-docgen-typescript';
import type { PropItem } from 'react-docgen-typescript';
import { listPublicComponents, ROOT } from './publicApi';
import type { ApiDoc, ApiProp, InheritedProps } from '../docs/src/api.types';

function isExternal(prop: PropItem): boolean {
    const decls = prop.declarations ?? (prop.parent ? [prop.parent] : []);
    return decls.length > 0 && decls.every((d) => d.fileName.includes('node_modules'));
}

/** Prints string literals with single quotes, matching the code style of the docs. */
function singleQuoted(text: string): string {
    return text.replace(/"([^"\\]*)"/g, "'$1'");
}

function typeOf(prop: PropItem): string {
    const { type } = prop;
    if (type.name === 'enum' && Array.isArray(type.value)) {
        const values = (type.value as { value: string }[]).map((v) => v.value);
        return singleQuoted(values.join(' | '));
    }
    return singleQuoted(type.raw ?? type.name).replace(
        /, string \| JSXElementConstructor<any>>/g,
        '>',
    );
}

/**
 * Default value as source text. Destructuring defaults of string props arrive unquoted
 * (`size = 'md'` → `md`), so a bare word that appears as a string literal in the type is quoted.
 */
function defaultOf(prop: PropItem, type: string): string | null {
    const holder: unknown = prop.defaultValue;
    const raw: unknown =
        typeof holder === 'object' && holder !== null && 'value' in holder
            ? holder.value
            : undefined;
    if (raw === undefined || raw === null || raw === '') return null;
    const text = singleQuoted(typeof raw === 'string' ? raw : JSON.stringify(raw));
    if (/^[\w-]+$/.test(text) && type.includes(`'${text}'`)) return `'${text}'`;
    return text;
}

/** API data of every public component, in barrel order. */
export function buildApiDocs(): ApiDoc[] {
    const parser = withCustomConfig(join(ROOT, 'tsconfig.json'), {
        savePropValueAsString: true,
        shouldExtractLiteralValuesFromEnum: true,
        shouldRemoveUndefinedFromOptional: true,
        shouldSortUnions: false,
        skipChildrenPropWithoutDoc: false,
    });

    return listPublicComponents().map((component) => {
        const docs = parser.parse(join(ROOT, component.file));
        const doc = docs.find((d) => d.displayName === component.name) ?? docs[0];

        const props: ApiProp[] = [];
        const inherited = new Map<string, number>();

        for (const prop of Object.values(doc?.props ?? {})) {
            if (isExternal(prop)) {
                const from = prop.parent?.name ?? 'HTML attributes';
                inherited.set(from, (inherited.get(from) ?? 0) + 1);
                continue;
            }
            const type = typeOf(prop);
            props.push({
                name: prop.name,
                type,
                required: prop.required,
                default: defaultOf(prop, type),
                description: prop.description.trim(),
            });
        }

        props.sort(
            (a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name),
        );

        const inheritedList: InheritedProps[] = [...inherited.entries()].map(([from, count]) => ({
            from,
            count,
        }));

        return {
            name: component.name,
            slug: component.slug,
            group: component.group,
            entry: component.entry,
            file: component.file,
            description: doc?.description.trim() ?? '',
            props,
            inherited: inheritedList,
        };
    });
}
