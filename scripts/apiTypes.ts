/**
 * Documents the public helper types that component props refer to (`TabItem`, `TableColumn`,
 * `AppOrbState`, ...): fields with type, default and JSDoc for object types, the definition for
 * unions and aliases. Only types exported from the package entries and declared in `src/` count.
 */
import { join } from 'node:path';
import ts from 'typescript';
import type { ApiProp, ApiType } from '../docs/src/api.types';
import { ROOT } from './publicApi';

const ENTRIES = ['src/lib.ts', 'src/ui/orb/index.ts'];

const TYPE_NAME_RE = /\b[A-Z][A-Za-z0-9]*\b/g;

/** Type names mentioned in a type expression, e.g. `TableColumn<T>[]` → `TableColumn`. */
export function typeNames(text: string): string[] {
    return [...text.matchAll(TYPE_NAME_RE)].map((m) => m[0]);
}

function singleQuoted(text: string): string {
    return text.replace(/"([^"\\]*)"/g, "'$1'");
}

/** Collapses multi-line type text (with member comments) into one line. */
function oneLine(text: string): string {
    return singleQuoted(
        text
            .replace(/\/\*[\s\S]*?\*\//g, ' ')
            .replace(/\/\/.*$/gm, ' ')
            .replace(/\s+/g, ' ')
            .replace(/^\| /, '')
            .trim(),
    );
}

function isInSrc(decl: ts.Declaration): boolean {
    const file = decl.getSourceFile().fileName.replace(/\\/g, '/');
    return file.includes('/src/') && !file.includes('/node_modules/');
}

export interface TypeExtractor {
    /** The helper type `name`, or undefined when it is not a public type declared in `src/`. */
    get: (name: string) => ApiType | undefined;
}

export function createTypeExtractor(): TypeExtractor {
    const configFile = ts.readConfigFile(join(ROOT, 'tsconfig.json'), (p) => ts.sys.readFile(p));
    const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, ROOT);
    const program = ts.createProgram(
        ENTRIES.map((e) => join(ROOT, e)),
        config.options,
    );
    const checker = program.getTypeChecker();

    const exported = new Map<string, ts.Symbol>();
    for (const entry of ENTRIES) {
        const source = program.getSourceFile(join(ROOT, entry));
        const moduleSymbol = source === undefined ? undefined : checker.getSymbolAtLocation(source);
        if (moduleSymbol === undefined) continue;
        for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
            const target =
                symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
            if (target.flags & (ts.SymbolFlags.Interface | ts.SymbolFlags.TypeAlias)) {
                exported.set(symbol.name, target);
            }
        }
    }

    function docOf(symbol: ts.Symbol): { description: string; defaultValue: string | null } {
        const description = ts
            .displayPartsToString(symbol.getDocumentationComment(checker))
            .replace(/\{@link\s+([^}\s|]+)[^}]*\}/g, '`$1`')
            .trim();
        const tag = symbol.getJsDocTags(checker).find((t) => t.name === 'default');
        const defaultValue =
            tag?.text === undefined ? null : singleQuoted(ts.displayPartsToString(tag.text).trim());
        return { description, defaultValue };
    }

    function fieldOf(member: ts.Symbol): ApiProp | undefined {
        const decl = member.valueDeclaration ?? member.declarations?.[0];
        if (decl === undefined || !isInSrc(decl)) return undefined;
        const typeNode =
            ts.isPropertySignature(decl) || ts.isPropertyDeclaration(decl) ? decl.type : undefined;
        const type = oneLine(
            typeNode !== undefined
                ? typeNode.getText()
                : checker.typeToString(checker.getTypeOfSymbolAtLocation(member, decl)),
        );
        const { description, defaultValue } = docOf(member);
        return {
            name: member.name,
            type,
            required: (member.flags & ts.SymbolFlags.Optional) === 0,
            default: defaultValue,
            description,
        };
    }

    const cache = new Map<string, ApiType | undefined>();

    function extract(name: string): ApiType | undefined {
        const symbol = exported.get(name);
        const decl = symbol?.declarations?.find(
            (d) => ts.isInterfaceDeclaration(d) || ts.isTypeAliasDeclaration(d),
        );
        if (symbol === undefined || decl === undefined || !isInSrc(decl)) return undefined;

        const { description } = docOf(symbol);
        const params =
            decl.typeParameters === undefined
                ? ''
                : `<${decl.typeParameters.map((p) => p.name.text).join(', ')}>`;
        const declared = checker.getDeclaredTypeOfSymbol(symbol);
        const isObject =
            ts.isInterfaceDeclaration(decl) ||
            ts.isTypeLiteralNode(decl.type) ||
            ts.isIntersectionTypeNode(decl.type);

        if (isObject) {
            const fields = checker
                .getPropertiesOfType(declared)
                .map(fieldOf)
                .filter((f): f is ApiProp => f !== undefined)
                .sort(
                    (a, b) =>
                        Number(b.required) - Number(a.required) || a.name.localeCompare(b.name),
                );
            return { name: `${name}${params}`, description, definition: null, fields };
        }
        return {
            name: `${name}${params}`,
            description,
            definition: oneLine(decl.type.getText()),
            fields: [],
        };
    }

    return {
        get(name) {
            if (!cache.has(name)) cache.set(name, extract(name));
            return cache.get(name);
        },
    };
}

/**
 * The public helper types a set of prop types refers to, followed transitively through their
 * fields and definitions (`NavListGroup` → `NavListItem`), in order of first mention.
 */
export function referencedTypes(
    extractor: TypeExtractor,
    typeTexts: string[],
    exclude: ReadonlySet<string> = new Set(),
): ApiType[] {
    const result: ApiType[] = [];
    const seen = new Set<string>(exclude);
    const queue = typeTexts.flatMap(typeNames);
    while (queue.length > 0) {
        const name = queue.shift() ?? '';
        if (seen.has(name)) continue;
        seen.add(name);
        const type = extractor.get(name);
        if (type === undefined) continue;
        result.push(type);
        queue.push(
            ...type.fields.flatMap((f) => typeNames(f.type)),
            ...typeNames(type.definition ?? ''),
        );
    }
    return result;
}
