import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type { MDXComponents } from 'mdx/types';
import { Callout, Divider } from '@ui';
import { DocsCodeBlock } from '../components/DocsCodeBlock';
import { ApiTable } from '../components/ApiTable';
import { ComponentMeta } from '../components/ComponentMeta';
import { Demo } from '../components/Demo';
import { Lead } from '../components/Lead';
import { TokenTable } from '../components/TokenTable';
import { ThemePlayground } from '../components/ThemePlayground';
import { MdxHeading } from './MdxHeading';
import { MdxLink } from './MdxLink';

/* Thin element wrappers that map Markdown output onto the HUD typography. */

function H1(props: ComponentPropsWithoutRef<'h1'>): ReactElement {
    return <MdxHeading level={1}>{props.children}</MdxHeading>;
}

function H2(props: ComponentPropsWithoutRef<'h2'>): ReactElement {
    return <MdxHeading level={2}>{props.children}</MdxHeading>;
}

function H3(props: ComponentPropsWithoutRef<'h3'>): ReactElement {
    return <MdxHeading level={3}>{props.children}</MdxHeading>;
}

function P(props: ComponentPropsWithoutRef<'p'>): ReactElement {
    return <p className="my-3 text-[12px] leading-[1.8] text-text-secondary">{props.children}</p>;
}

function Ul(props: ComponentPropsWithoutRef<'ul'>): ReactElement {
    return (
        <ul className="my-3 pl-5 list-[square] marker:text-accent-dim text-[12px] leading-[1.8] text-text-secondary">
            {props.children}
        </ul>
    );
}

function Ol(props: ComponentPropsWithoutRef<'ol'>): ReactElement {
    return (
        <ol className="my-3 pl-5 list-decimal marker:text-accent-dim text-[12px] leading-[1.8] text-text-secondary">
            {props.children}
        </ol>
    );
}

function Li(props: ComponentPropsWithoutRef<'li'>): ReactElement {
    return <li className="my-1 pl-1">{props.children}</li>;
}

function InlineCode(props: ComponentPropsWithoutRef<'code'>): ReactElement {
    return (
        <code className="px-[5px] py-[1px] rounded-[2px] bg-surface-raised border border-border text-accent-bright text-[11px]">
            {props.children}
        </code>
    );
}

function Strong(props: ComponentPropsWithoutRef<'strong'>): ReactElement {
    return <strong className="font-medium text-text">{props.children}</strong>;
}

function Blockquote(props: ComponentPropsWithoutRef<'blockquote'>): ReactElement {
    return <Callout className="my-4">{props.children}</Callout>;
}

function Hr(): ReactElement {
    return <Divider className="my-8" variant="accent" />;
}

function TableEl(props: ComponentPropsWithoutRef<'table'>): ReactElement {
    return (
        <div className="my-4 overflow-x-auto border border-border rounded-[2px]">
            <table className="w-full border-collapse text-[11px]">{props.children}</table>
        </div>
    );
}

function Th(props: ComponentPropsWithoutRef<'th'>): ReactElement {
    return (
        <th className="px-3 py-2 text-left text-[9px] font-normal uppercase tracking-[1px] text-text-secondary border-b border-border-bright">
            {props.children}
        </th>
    );
}

function Td(props: ComponentPropsWithoutRef<'td'>): ReactElement {
    return (
        <td className="px-3 py-2 align-top text-text-secondary border-b border-border">
            {props.children}
        </td>
    );
}

/** Components available in every MDX page without an import. */
export const mdxComponents: MDXComponents = {
    h1: H1,
    h2: H2,
    h3: H3,
    p: P,
    a: MdxLink,
    ul: Ul,
    ol: Ol,
    li: Li,
    code: InlineCode,
    strong: Strong,
    blockquote: Blockquote,
    hr: Hr,
    table: TableEl,
    th: Th,
    td: Td,
    ApiTable,
    Callout,
    CodeBlock: DocsCodeBlock,
    ComponentMeta,
    Demo,
    Lead,
    ThemePlayground,
    TokenTable,
};
