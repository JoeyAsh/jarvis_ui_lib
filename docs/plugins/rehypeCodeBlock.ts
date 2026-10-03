import { highlightToInnerHtml } from './highlight.ts';

/* Minimal hast shapes — enough for this transform without depending on transitive type packages. */
interface HastText {
    type: 'text';
    value: string;
}

interface HastElement {
    type: 'element';
    tagName: string;
    properties?: Record<string, unknown>;
    children: HastNode[];
}

interface MdxJsxAttribute {
    type: 'mdxJsxAttribute';
    name: string;
    value: string;
}

interface MdxJsxFlowElement {
    type: 'mdxJsxFlowElement';
    name: string;
    attributes: MdxJsxAttribute[];
    children: HastNode[];
}

interface HastParent {
    type: string;
    children: HastNode[];
}

type HastNode =
    HastText | HastElement | MdxJsxFlowElement | { type: string; children?: HastNode[] };

function isElement(node: HastNode, tagName: string): node is HastElement {
    return node.type === 'element' && (node as HastElement).tagName === tagName;
}

function textOf(node: HastNode): string {
    if (node.type === 'text') return (node as HastText).value;
    const children = 'children' in node ? node.children : undefined;
    return children ? children.map(textOf).join('') : '';
}

function languageOf(code: HastElement): string | undefined {
    const cls = code.properties?.className;
    const list = Array.isArray(cls) ? cls.map(String) : [];
    return list.find((c) => c.startsWith('language-'))?.slice('language-'.length);
}

/**
 * Replaces every fenced code block (`pre > code`) in MDX with
 * `<CodeBlock code="…" html="…" language="…" />`, highlighted by shiki at build time.
 * `CodeBlock` must be provided through the MDX components map.
 */
export function rehypeCodeBlock() {
    return async (tree: HastParent): Promise<void> => {
        const jobs: Promise<void>[] = [];

        function walk(parent: HastParent): void {
            parent.children.forEach((child, index) => {
                if (isElement(child, 'pre')) {
                    const code = child.children.find((c): c is HastElement => isElement(c, 'code'));
                    if (code) {
                        const source = textOf(code).replace(/\n$/, '');
                        const language = languageOf(code);
                        jobs.push(
                            highlightToInnerHtml(source, language).then((html) => {
                                const attributes: MdxJsxAttribute[] = [
                                    { type: 'mdxJsxAttribute', name: 'code', value: source },
                                    { type: 'mdxJsxAttribute', name: 'html', value: html },
                                ];
                                if (language !== undefined) {
                                    attributes.push({
                                        type: 'mdxJsxAttribute',
                                        name: 'language',
                                        value: language,
                                    });
                                }
                                parent.children[index] = {
                                    type: 'mdxJsxFlowElement',
                                    name: 'CodeBlock',
                                    attributes,
                                    children: [],
                                };
                            }),
                        );
                        return;
                    }
                }
                if ('children' in child && Array.isArray(child.children)) {
                    walk(child as HastParent);
                }
            });
        }

        walk(tree);
        await Promise.all(jobs);
    };
}
